"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribeAll = unsubscribeAll;
const __1 = require("..");
const closeWebsockets_1 = require("./closeWebsockets");
const getSubscriptions_1 = require("./getSubscriptions");
const unsubscribe_1 = require("./unsubscribe");
function unsubscribeAll(sym) {
    return new Promise((resolve, reject) => {
        (0, getSubscriptions_1.getSubscriptions)(sym)
            .then(async (subscriptions) => {
            await Promise.all(subscriptions.data.filter(a => a.status === "enabled").map(subscription => {
                return new Promise((resolve2) => {
                    (0, unsubscribe_1.unsubscribe)(sym, subscription.id)
                        .then(resolve2)
                        .catch(resolve2);
                });
            }))
                .then(() => {
                __1.i.eventsubClientData[sym].subscriptions = {};
                Object.keys(__1.i.websocketData[sym]).forEach(wsNum => {
                    __1.i.websocketData[sym][wsNum].subscriptions = {};
                });
                (0, closeWebsockets_1.closeWebsockets)(sym);
                resolve();
            });
        })
            .catch(e => {
            return reject(Error("Could not get subscriptions from API", { "cause": e }));
        });
    });
}
;
