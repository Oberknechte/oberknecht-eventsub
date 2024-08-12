import { oberknechtAPI } from "oberknecht-api";
import { streamOnlineMessage } from "../parser/notifications/stream.online";
import { oberknechtEmitter } from "oberknecht-emitters";
import { convertToArray, regex } from "oberknecht-utils";
import { i } from "..";
import { subscribe } from "../functions/subscribe";
import { unsubscribe } from "../functions/unsubscribe";
import { getSubscriptions } from "../functions/getSubscriptions";
import { unsubscribeAll } from "../functions/unsubscribeAll";
import { eventsubClientOptions } from "../types/eventsub.client.options";
import { subscriptionType } from "../types/subscription.type";
import { closeWebsockets } from "../functions/closeWebsockets";
import { messageParser } from "../parser/messageParser";
import { channelModerateMessagev2 } from "../parser/notifications/channel.moderate.v2";

const onStreamOnlineCallback = (notification: streamOnlineMessage) => {};
const onModactionCallback = (notification: channelModerateMessagev2) => {};
const onErrorCallback = (e: Error) => {};
const onCloseCallback = (e: Record<string, any>) => {};
const onResubscribeCallback = (e: {
  success: boolean;
  resubscribeData?: Record<string, any>;
  resubscribeArgs: Array<any>;
  error?: Error;
}) => {};
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
      ...(_options.oberknechtAPIOptions ?? {}),
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
    return this.OberknechtEmitter.on("error", callback);
  };
  onClose = (callback: typeof onCloseCallback) => {
    return this.OberknechtEmitter.on("ws:close", callback);
  };

  onResubscribe = (callback: typeof onResubscribeCallback) => {
    return this.OberknechtEmitter.on("resubscribe", callback);
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

  async onModaction(callback: typeof onModactionCallback) {
    this.OberknechtEmitter.on("notification:channel.moderate", callback);
  }

  async subscribe(type: subscriptionType, condition: any, version?: string) {
    return subscribe(this.symbol, type, condition, undefined, version);
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

  async imitateMessage(message: Record<string, any>) {
    return messageParser(this.symbol, message, "0");
  }

  async subscribeToStreamOnline(
    broadcasterLogins: string | string[] | undefined,
    broadcasterIDs?: string | string[],
    requestAll?: boolean
  ) {
    return new Promise(async (resolve, reject) => {
      let broadcasterLogins_ = convertToArray(broadcasterLogins);
      let broadcasterIDs_ = convertToArray(broadcasterIDs);
      let broadcasterDatas = {};
      if (broadcasterLogins_.length > 0 || requestAll)
        await this.OberknechtAPI.getUsers(
          broadcasterLogins_,
          requestAll ? broadcasterIDs_ : []
        )
          .then((broadcasters) => {
            broadcasterIDs_ = [
              ...broadcasterIDs_,
              ...Object.keys(broadcasters.ids),
            ];
            broadcasterDatas = broadcasters.details;
          })
          .catch((e) => {
            return reject([Error("Could not get broadcasters", { cause: e })]);
          });

      Promise.all(
        broadcasterIDs_.map((broadcasterID) => {
          return new Promise((resolve2, reject2) => {
            this.subscribe("stream.online", {
              broadcaster_user_id: broadcasterID,
            })
              .then((subscription) => {
                return resolve2({
                  ...(broadcasterDatas[broadcasterID] ?? {}),
                  subscription: subscription?.data?.[0],
                });
              })
              .catch(reject2);
          });
        })
      )
        .then(resolve)
        .catch(reject);
    });
  }

  async subscribeToModactions(
    broadcasterLogins: string | string[] | undefined,
    broadcasterIDs?: string | string[]
  ) {
    return new Promise(async (resolve, reject) => {
      let broadcasterLogins_ = convertToArray(broadcasterLogins);
      let broadcasterIDs_ = convertToArray(broadcasterIDs);
      if (broadcasterLogins_.length > 0)
        await this.OberknechtAPI.getUsers(broadcasterLogins_)
          .then((broadcasters) => {
            broadcasterIDs_ = [
              ...broadcasterIDs_,
              ...Object.keys(broadcasters.ids),
            ];
          })
          .catch((e) => {
            return reject([Error("Could not get broadcasters", { cause: e })]);
          });

      if (!this.OberknechtAPI.verified) await this.OberknechtAPI.verify();

      // console.log(this.OberknechtAPI.options);

      Promise.all(
        broadcasterIDs_.map((broadcasterID) => {
          return new Promise((resolve2, reject2) => {
            this.subscribe(
              "channel.moderate",
              {
                broadcaster_user_id: broadcasterID,
                moderator_user_id: this.OberknechtAPI.options.userid,
              },
              "2"
            )
              .then((subscription) => {
                return resolve2({
                  subscription: subscription
                });
              })
              .catch(reject2);
          });
        })
      )
        .then(resolve)
        .catch(reject);
    });
  }
}
