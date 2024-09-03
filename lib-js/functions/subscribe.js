"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = void 0;
const __1 = require("..");
const createWs_1 = require("./createWs");
const getFreeWsNum_1 = require("./getFreeWsNum");
const oberknecht_utils_1 = require("oberknecht-utils");
let creatingWsPromise = {};
let creatingWS = {};
let inQueue = {};
async function subscribe(sym, type, condition, transport, version) {
    return new Promise(async (resolve, reject) => {
        if (!inQueue[sym])
            inQueue[sym] = 0;
        function getDelay() {
            return (inQueue[sym] *
                (__1.i.eventsubClientData[sym]._options.subscribeDelay ?? 300));
        }
        inQueue[sym]++;
        const myDelay = getDelay();
        await (0, oberknecht_utils_1.sleep)(myDelay);
        inQueue[sym]--;
        if (creatingWS[sym])
            await creatingWsPromise[sym];
        let wsNum = (0, getFreeWsNum_1.getFreeWsNum)(sym);
        if (wsNum === undefined) {
            creatingWS[sym] = true;
            creatingWsPromise[sym] = new Promise(async (resolve, reject) => {
                await (0, createWs_1.createWs)(sym)
                    .then((wsNum_) => {
                    wsNum = wsNum_;
                    resolve(wsNum_);
                })
                    .catch(reject);
            });
            wsNum = await creatingWsPromise[sym];
            creatingWS[sym] = false;
        }
        let wsData = __1.i.websocketData[sym][wsNum];
        let transport_ = transport ?? {
            method: "websocket",
            session_id: __1.i.websocketData?.[sym]?.[wsNum]?.sessionData?.id,
        };
        await __1.i.OberknechtAPI[sym]
            .addEventsubSubscription(type, version, condition, transport_)
            .then((subscription) => {
            __1.i.eventsubClientData[sym].totalSubscriptions = subscription.total;
            __1.i.eventsubClientData[sym].totalCost = subscription.total_cost;
            let subscriptionParsed = {
                ...subscription.data[0],
                wsNum: wsNum,
                wsArgs: [type, condition, transport, version],
            };
            if (!__1.i.eventsubClientData[sym].subscriptions)
                __1.i.eventsubClientData[sym].subscriptions = {};
            __1.i.eventsubClientData[sym].subscriptions[subscription.data[0].id] = subscriptionParsed;
            if (!wsData.subscriptions)
                wsData.subscriptions = {};
            wsData.subscriptions[subscription.data[0].id] = subscriptionParsed;
            return resolve(subscription);
        })
            .catch((e) => {
            __1.i.OberknechtEmitter[sym].emitError(["ws:error:subscribe", `ws:${wsNum}:error:subscribe`], e);
            return reject(Error("Could not subscribe to event", { cause: e }));
        });
    });
}
exports.subscribe = subscribe;
