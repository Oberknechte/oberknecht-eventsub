import { oberknechtAPI } from "oberknecht-api";
import { streamOnlineMessage } from "../parser/notifications/stream.online";
import { oberknechtEmitter } from "oberknecht-emitters";
import { convertToArray } from "oberknecht-utils";
import { i } from "..";
import { subscribe } from "../functions/subscribe";
import { unsubscribe } from "../functions/unsubscribe";
import { getSubscriptions } from "../functions/getSubscriptions";
import { unsubscribeAll } from "../functions/unsubscribeAll";
import { eventsubClientOptions } from "../types/eventsub.client.options";
import { subscriptionType } from "../types/subscription.type";
import { closeWebsockets } from "../functions/closeWebsockets";

const onStreamOnlineCallback = (notification: streamOnlineMessage) => {};
const onErrorCallback = (e: Error) => {};
let clientSymNum = 0;

export class oberknechtEventsub {
  readonly #symbol = `oberknechtEventsub-${clientSymNum++}`;
  #wsUrl = "wss://eventsub.wss.twitch.tv/ws";
  #maxTotalCost = 10;
  #maxConnections = 3;

  get symbol() {
    return this.#symbol;
  }
  get clientData() {
    return i.eventsubClientData[this.symbol] ?? {};
  }
  get clientWebsockets() {
    return i.WebSockets[this.symbol] ?? {};
  }
  get clientWebsocketData() {
    return i.websocketData[this.symbol] ?? {};
  }
  get _options() {
    return i.eventsubClientData[this.symbol]._options ?? {};
  }
  get WebSockets() {
    return i.WebSockets[this.symbol];
  }
  OberknechtEmitter = new oberknechtEmitter();
  OberknechtAPI = new oberknechtAPI({ skipCreation: true, token: undefined });

  constructor(options: eventsubClientOptions) {
    let _options = (options ?? {}) as eventsubClientOptions;
    i.eventsubClientData[this.symbol] = {
      _options: _options,
      wsUrl: this.#wsUrl,
      maxConnections: this.#maxConnections,
      maxTotalCost: this.#maxTotalCost,
      totalSubscriptions: 0,
      get totalConnections() {
        return Object.keys(i.WebSockets[this.symbol]).map(
          (a) => i.WebSockets[this.symbol][a].readyState === 1
        ).length;
      },
      totalCost: 0,
      wsNum: 0,
      creatingWS: false,
      get maxConnectionsReached() {
        return (
          i.eventsubClientData[this.symbol].totalConnections >=
          i.eventsubClientData[this.symbol].maxConnections
        );
      },
      stayAwakeInterval: setInterval(() => {}, 60 * 1000),
    };

    i.OberknechtEmitter[this.symbol] = this.OberknechtEmitter;
    this.OberknechtAPI = i.OberknechtAPI[this.symbol] = new oberknechtAPI({
      token: _options.token,
    });
  }

  async connect() {
    return new Promise<void>(async (resolve, reject) => {
      await i.OberknechtAPI[this.symbol].verify().catch(reject);
      resolve();
    });
  }

  on = this.OberknechtEmitter.on;
  once = this.OberknechtEmitter.once;
  onError = (callback: typeof onErrorCallback) => {
    return this.OberknechtEmitter.on("error", onErrorCallback);
  };

  closeWebsocket = (wsNum: number) => {
    if (i.websocketData[this.symbol]?.[wsNum])
      i.websocketData[this.symbol][wsNum].subscriptions = [];

    return i.WebSockets[this.symbol]?.[wsNum]?.close();
  };
  closeWebsockets = () => {
    return closeWebsockets(this.symbol);
  };

  async onStreamOnline(callback: typeof onStreamOnlineCallback) {
    this.OberknechtEmitter.on("notification:stream.online", callback);
  }

  async subscribe(type: subscriptionType, condition: any) {
    return subscribe(this.symbol, type, condition);
  }
  async unsubscribe(id: string) {
    return unsubscribe(this.symbol, id);
  }
  async unsubscribeAll() {
    return unsubscribeAll(this.symbol);
  }
  async getSubscriptions(cacheOnly?: boolean, wsNum?: null) {
    return getSubscriptions(this.symbol, cacheOnly, wsNum);
  }

  async subscribeToStreamOnline(broadcasters: string | string[]) {
    return new Promise((resolve, reject) => {
      let broadcasters_ = convertToArray(broadcasters);
      this.OberknechtAPI.getUsers(broadcasters_)
        .then((broadcasters) => {
          Promise.all(
            Object.keys(broadcasters.ids).map((broadcasterID) => {
              return new Promise((resolve2, reject2) => {
                this.subscribe("stream.online", {
                  broadcaster_user_id: broadcasterID,
                })
                  .then((subscription) => {
                    return resolve2({
                      ...broadcasters.details[broadcasterID],
                      subscription: subscription?.data?.[0],
                    });
                  })
                  .catch(reject2);
              });
            })
          )
            .then(resolve)
            .catch(reject);
        })
        .catch((e) => {
          return reject([Error("Could not get broadcasters", { cause: e })]);
        });
    });
  }
}
