import { i } from "..";
import { WebSocket } from "ws";
import { messageParser } from "../parser/messageParser";
import { subscribe } from "./subscribe";

export function createWs(sym: string, oldWsNum?: number, oldWSError?: any) {
  let clientData = i.eventsubClientData[sym];
  const wsNum = clientData.wsNum;
  clientData.wsNum++;

  if (!i.WebSockets[sym]) i.WebSockets[sym] = {};
  if (!i.websocketData[sym]) i.websocketData[sym] = {};

  let oldWSData = i.websocketData[sym]?.[oldWsNum];
  let useRecreateWSNum = oldWsNum ?? wsNum;

  let OberknechtEmitter = i.OberknechtEmitter[sym];

  let ws = new WebSocket(clientData.wsUrl);
  // let ws = (i.WebSockets[sym][wsNum] = new WebSocket(clientData.wsUrl));
  i.websocketData[sym][wsNum] = {
    get readyState() {
      return ws.readyState;
    },
    subscriptions: [],
  };

  ws.on("open", () => {
    OberknechtEmitter.emit(["open", "ws:open", `ws:${wsNum}:open`], {
      wsNum: wsNum,
    });
  });

  ws.on("close", (code, reason) => {
    OberknechtEmitter.emit(["close", "ws:close", `ws:${wsNum}:close`], {
      code: code,
      reason: reason,
      wsNum: wsNum,
    });

    if (i.websocketData?.[sym]?.[wsNum]?.heartbeatInterval)
      clearInterval(i.websocketData[sym][wsNum].heartbeatInterval);

    if (code === 1000 || !i.eventsubClientData[sym]._options.autoReconnect)
      return;

    setTimeout(() => {
      createWs(sym, useRecreateWSNum, {
        code: code,
        reason: reason,
      }).catch((e) => {
        OberknechtEmitter.emitError(
          ["error", "ws:error", `ws:${wsNum}:error`],
          {
            error: e,
            wsNum: wsNum,
          }
        );
      });
    }, 30000);
  });

  ws.on("error", (e) => {
    OberknechtEmitter.emitError(["error", "ws:error", `ws:${wsNum}:error`], {
      error: e,
      wsNum: wsNum,
    });
  });

  ws.on("message", (responseRaw: Buffer) => {
    const response = Buffer.from(responseRaw).toString("utf-8");
    const responseParsed = JSON.parse(response);
    OberknechtEmitter.emit(["message", "ws:message", `ws:${wsNum}:message`], {
      response: responseParsed,
      wsNum: wsNum,
    });
    messageParser(sym, responseParsed, wsNum);

    i.websocketData[sym][wsNum].lastAlive = Date.now();
    i.websocketData[sym][wsNum].pendingPings = 0;
  });

  ws.on("ping", () => {
    if(ws.readyState !== 1) return;
    ws.pong();

    i.websocketData[sym][wsNum].lastAlive = Date.now();
    i.websocketData[sym][wsNum].pendingPings = 0;
  });

  ws.on("pong", () => {
    i.websocketData[sym][wsNum].lastAlive = Date.now();
    i.websocketData[sym][wsNum].pendingPings = 0;
  });

  function heartbeat() {
    if (
      i.websocketData[sym][wsNum].pendingPings >
        i.eventsubClientData[sym]?._options?.wsHeartbeatUntilReconnect ??
      2
    ) {
      ws.close(1012);
      return;
    }

    if(ws.readyState === 1) ws.ping();;

    i.websocketData[sym][wsNum].pendingPings++;
  }

  i.websocketData[sym][wsNum].heartbeatInterval = setInterval(
    heartbeat,
    i.eventsubClientData[sym]?._options?.wsHeartbeatInterval ?? 5000
  );

  return new Promise<number>((resolve) => {
    return OberknechtEmitter.once(`ws:${wsNum}:session_welcome`, () => {
      resolve(wsNum);

      if (!oldWSData) return;

      Promise.all(
        Object.keys(oldWSData.subscriptions).map((id) => {
          return new Promise((resolve2, reject2) => {
            let subscription = oldWSData.subscriptions[id];

            let wsArgs = subscription.wsArgs;

            subscribe(sym, wsArgs[0], wsArgs[1], wsArgs[2], wsArgs[3])
              .then((r) => {
                OberknechtEmitter.emit(
                  [
                    "resubscribe",
                    "resubscribeSuccess",
                    `ws:${wsNum}:resubscribe`,
                    `ws:${wsNum}:resubscribeSuccess`,
                  ],
                  {
                    success: true,
                    resubscribeData: r,
                    resubscribeArgs: wsArgs,
                    oldWSError: oldWSError,
                  }
                );
              })
              .catch((e) => {
                OberknechtEmitter.emit(
                  [
                    "resubscribe",
                    "resubscribeError",
                    `ws:${wsNum}:resubscribe`,
                    `ws:${wsNum}:resubscribeError`,
                  ],
                  {
                    success: false,
                    error: e,
                    resubscribeArgs: wsArgs,
                    oldWSError: oldWSError,
                  }
                );
              });
          });
        })
      ).then(() => {
        delete i.websocketData[sym][oldWsNum];
        useRecreateWSNum = wsNum;
      });

      useRecreateWSNum = wsNum;
    });
  });
}
