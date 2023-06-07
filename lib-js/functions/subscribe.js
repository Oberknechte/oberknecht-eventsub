"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = void 0;
const __1 = require("..");
const createWs_1 = require("./createWs");
const getFreeWsNum_1 = require("./getFreeWsNum");
let creatingWsPromise;
let creatingWS = false;
async function subscribe(sym, type, condition, transport) {
    return new Promise(async (resolve, reject) => {
        if (creatingWS)
            await creatingWsPromise;
        let wsNum = (0, getFreeWsNum_1.getFreeWsNum)(sym);
        if (wsNum === undefined) {
            creatingWS = true;
            creatingWsPromise = new Promise(async (resolve, reject) => {
                wsNum = await (0, createWs_1.createWs)(sym)
                    .then(resolve)
                    .catch(reject);
            });
            wsNum = await creatingWsPromise;
            creatingWS = false;
        }
        ;
        let wsData = __1.i.websocketData[sym][wsNum];
        let transport_ = (transport ?? {
            method: "websocket",
            session_id: __1.i.websocketData?.[sym]?.[wsNum]?.sessionData?.id
        });
        await __1.i.OberknechtAPI[sym].addEventsubSubscription(type, undefined, condition, transport_)
            .then(subscription => {
            __1.i.eventsubClientData[sym].totalSubscriptions = subscription.total;
            __1.i.eventsubClientData[sym].totalCost = subscription.total_cost;
            let subscriptionParsed = {
                ...subscription.data[0],
                wsNum: wsNum
            };
            if (!__1.i.eventsubClientData[sym].subscriptions)
                __1.i.eventsubClientData[sym].subscriptions = [];
            __1.i.eventsubClientData[sym].subscriptions.push(subscriptionParsed);
            wsData.subscriptions.push(subscriptionParsed);
            return resolve(subscription);
        })
            .catch(e => {
            __1.i.OberknechtEmitter[sym].emitError(["ws:error:subscribe", `ws:${wsNum}:error:subscribe`], e);
            return reject(Error("Could not subscribe to event", { "cause": e }));
        });
    });
}
exports.subscribe = subscribe;
;
