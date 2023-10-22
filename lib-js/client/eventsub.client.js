"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oberknechtEventsub = void 0;
const oberknecht_api_1 = require("oberknecht-api");
const oberknecht_emitters_1 = require("oberknecht-emitters");
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
const subscribe_1 = require("../functions/subscribe");
const unsubscribe_1 = require("../functions/unsubscribe");
const getSubscriptions_1 = require("../functions/getSubscriptions");
const unsubscribeAll_1 = require("../functions/unsubscribeAll");
const closeWebsockets_1 = require("../functions/closeWebsockets");
const messageParser_1 = require("../parser/messageParser");
const onStreamOnlineCallback = (notification) => { };
const onErrorCallback = (e) => { };
let clientSymNum = 0;
class oberknechtEventsub {
    #symbol = `oberknechtEventsub-${clientSymNum++}`;
    #wsUrl = "wss://eventsub.wss.twitch.tv/ws";
    #maxTotalCost = 10;
    #maxConnections = 3;
    get symbol() {
        return this.#symbol;
    }
    get clientData() {
        return __1.i.eventsubClientData[this.symbol] ?? {};
    }
    get clientWebsockets() {
        return __1.i.WebSockets[this.symbol] ?? {};
    }
    get clientWebsocketData() {
        return __1.i.websocketData[this.symbol] ?? {};
    }
    get _options() {
        return __1.i.eventsubClientData[this.symbol]._options ?? {};
    }
    get WebSockets() {
        return __1.i.WebSockets[this.symbol];
    }
    OberknechtEmitter = new oberknecht_emitters_1.oberknechtEmitter();
    OberknechtAPI = new oberknecht_api_1.oberknechtAPI({ skipCreation: true, token: undefined });
    constructor(options) {
        let _options = (options ?? {});
        __1.i.eventsubClientData[this.symbol] = {
            _options: _options,
            wsUrl: this.#wsUrl,
            maxConnections: this.#maxConnections,
            maxTotalCost: this.#maxTotalCost,
            totalSubscriptions: 0,
            get totalConnections() {
                return Object.keys(__1.i.WebSockets[this.symbol]).map((a) => __1.i.WebSockets[this.symbol][a].readyState === 1).length;
            },
            totalCost: 0,
            wsNum: 0,
            creatingWS: false,
            get maxConnectionsReached() {
                return (__1.i.eventsubClientData[this.symbol].totalConnections >=
                    __1.i.eventsubClientData[this.symbol].maxConnections);
            },
            stayAwakeInterval: setInterval(() => { }, 60 * 1000),
        };
        __1.i.OberknechtEmitter[this.symbol] = this.OberknechtEmitter;
        this.OberknechtAPI = __1.i.OberknechtAPI[this.symbol] = new oberknecht_api_1.oberknechtAPI({
            token: _options.token,
        });
    }
    async connect() {
        return new Promise(async (resolve, reject) => {
            await __1.i.OberknechtAPI[this.symbol].verify().catch(reject);
            resolve();
        });
    }
    on = this.OberknechtEmitter.on;
    once = this.OberknechtEmitter.once;
    onError = (callback) => {
        return this.OberknechtEmitter.on("error", onErrorCallback);
    };
    closeWebsocket = (wsNum) => {
        if (__1.i.websocketData[this.symbol]?.[wsNum])
            __1.i.websocketData[this.symbol][wsNum].subscriptions = [];
        return __1.i.WebSockets[this.symbol]?.[wsNum]?.close();
    };
    closeWebsockets = () => {
        return (0, closeWebsockets_1.closeWebsockets)(this.symbol);
    };
    async onStreamOnline(callback) {
        this.OberknechtEmitter.on("notification:stream.online", callback);
    }
    async subscribe(type, condition) {
        return (0, subscribe_1.subscribe)(this.symbol, type, condition);
    }
    async unsubscribe(id) {
        return (0, unsubscribe_1.unsubscribe)(this.symbol, id);
    }
    async unsubscribeAll() {
        return (0, unsubscribeAll_1.unsubscribeAll)(this.symbol);
    }
    async getSubscriptions(cacheOnly, wsNum) {
        return (0, getSubscriptions_1.getSubscriptions)(this.symbol, cacheOnly, wsNum);
    }
    async imitateMessage(message) {
        return (0, messageParser_1.messageParser)(this.symbol, message, "0");
    }
    async subscribeToStreamOnline(broadcasters) {
        return new Promise((resolve, reject) => {
            let broadcasters_ = (0, oberknecht_utils_1.convertToArray)(broadcasters);
            this.OberknechtAPI.getUsers(broadcasters_)
                .then((broadcasters) => {
                Promise.all(Object.keys(broadcasters.ids).map((broadcasterID) => {
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
                }))
                    .then(resolve)
                    .catch(reject);
            })
                .catch((e) => {
                return reject([Error("Could not get broadcasters", { cause: e })]);
            });
        });
    }
}
exports.oberknechtEventsub = oberknechtEventsub;
