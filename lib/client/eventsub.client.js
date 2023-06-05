const { oberknechtEmitter } = require("oberknecht-emitters");
const { oberknechtAPI } = require("oberknecht-api");
const { convertToArray } = require("oberknecht-utils");
let i = require("..");
const eventsubClientOptions = require("../types/eventsub.client.options");
const subscribe = require("../functions/subscribe");
const unsubscribe = require("../functions/unsubscribe");
const getSubscriptions = require("../functions/getSubscriptions");
const unsubscribeAll = require("../functions/unsubscribeAll");
const streamOnlineMessage = require("../parser/notifications/stream.online");

/** @param {streamOnlineMessage} notification */
const onStreamOnlineCallback = (notification) => { };

class eventsubClient {
    #symbol = Symbol();
    #wsUrl = "wss://eventsub.wss.twitch.tv/ws";
    #maxTotalCost = 10;
    #maxConnections = 3;

    get symbol() { return this.#symbol };
    get clientData() { return i.eventsubClientData[this.symbol] ?? {} };
    get clientWebsockets() { return i.WebSockets[this.symbol] ?? {} };
    get clientWebsocketData() { return i.websocketData[this.symbol] ?? {} };
    get _options() { return i.eventsubClientData[this.symbol]._options ?? {} };
    get WebSockets() { return i.WebSockets[this.symbol] };
    OberknechtEmitter = new oberknechtEmitter();
    /** @instance oberknechtAPI */
    OberknechtAPI;

    /** @param {eventsubClientOptions} options */
    constructor(options) {
        const symbol = this.symbol;
        let _options = (options ?? {});
        i.eventsubClientData[this.symbol] = {
            _options: _options,
            wsUrl: this.#wsUrl,
            maxConnections: this.#maxConnections,
            maxTotalCost: this.#maxTotalCost,
            totalSubscriptions: 0,
            get totalConnections() { return Object.keys(i.WebSockets[symbol]).map(a => i.WebSockets[symbol][a].readyState === 1).length },
            totalCost: 0,
            wsNum: 0,
            creatingWS: false,
            get maxConnectionsReached() { return i.eventsubClientData[symbol].totalConnections >= i.eventsubClientData[symbol].maxConnections },
            stayAwakeInterval: setInterval(() => { }, (60 * 1000))
        };

        i.OberknechtEmitter[this.symbol] = this.OberknechtEmitter;
        this.OberknechtAPI = i.OberknechtAPI[this.symbol] = new oberknechtAPI({
            token: _options.token
        });
    };

    async connect() {
        return new Promise(async (resolve, reject) => {
            await i.OberknechtAPI[this.symbol].verify();
            resolve();
        });
    };

    on = this.OberknechtEmitter.on;
    once = this.OberknechtEmitter.once;

    closeWebsocket = (wsNum) => {
        if (i.websocketData[this.symbol]?.[wsNum]) i.websocketData[this.symbol][wsNum].subscriptions = [];

        return i.WebSockets[this.symbol]?.[wsNum]?.close();
    };
    closeWebsockets = () => {
        Object.keys((i.WebSockets[this.symbol] ?? {})).forEach(wsNum => {
            i.WebSockets[this.symbol][wsNum].close();
            i.websocketData[this.symbol][wsNum].subscriptions = [];
        });

        i.eventsubClientData[this.symbol].subscriptions = [];

        return;
    };

    /** @param {onStreamOnlineCallback} callback */
    async onStreamOnline(callback) {
        this.OberknechtEmitter.on("notification:stream.online", callback);
    };

    async subscribe(type, condition) { return subscribe(this.symbol, type, condition) };
    async unsubscribe(id) { return unsubscribe(this.symbol, id) };
    async unsubscribeAll() { return unsubscribeAll(this.symbol) };
    async getSubscriptions(cacheOnly, wsNum) { return getSubscriptions(this.symbol, cacheOnly, wsNum) };

    /** @param {Array<string> | string} broadcasters */
    async subscribeToStreamOnline(broadcasters) {
        return new Promise((resolve, reject) => {
            let broadcasters_ = convertToArray(broadcasters);
            this.OberknechtAPI.getUsers(broadcasters_)
                .then(broadcasters => {
                    Promise.all(Object.keys(broadcasters.ids).map(broadcasterID => {
                        return new Promise((resolve2, reject2) => {
                            this.subscribe("stream.online", { broadcaster_user_id: broadcasterID })
                                .then(subscription => {
                                    return resolve2({
                                        ...broadcasters.details[broadcasterID],
                                        subscription: subscription?.data?.[0]
                                    });
                                })
                                .catch(reject2);
                        });
                    }))
                        .then(resolve)
                        .catch(reject);
                })
                .catch(e => {
                    return reject([Error("Could not get broadcasters", { "cause": e })]);
                });
        });
    };
};

module.exports = eventsubClient;