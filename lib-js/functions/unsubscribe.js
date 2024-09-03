"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribe = void 0;
const __1 = require("..");
function unsubscribe(sym, id) {
    return new Promise((resolve, reject) => {
        let wsSubscription = __1.i.eventsubClientData[sym]?.subscriptions?.[id];
        let wsNum = wsSubscription?.wsNum;
        __1.i.OberknechtAPI[sym]
            .deleteEventsubSubscription(id)
            .then(() => {
            if (wsNum) {
                delete __1.i.eventsubClientData[sym].subscriptions[id];
                delete __1.i.websocketData[sym]?.[wsNum]?.subscriptions?.[id];
            }
            return resolve();
        })
            .catch((e) => {
            return reject(Error("Could not unsubscribe from event", { cause: e }));
        });
    });
}
exports.unsubscribe = unsubscribe;
