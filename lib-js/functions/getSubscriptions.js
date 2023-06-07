"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptions = void 0;
const __1 = require("..");
async function getSubscriptions(sym, cachedOnly, wsNum) {
    return new Promise((resolve, reject) => {
        if (cachedOnly) {
            if (wsNum)
                return resolve((__1.i.websocketData[sym][wsNum]?.subscriptions ?? []));
            return resolve((__1.i.eventsubClientData[sym].subscriptions ?? []));
        }
        ;
        __1.i.OberknechtAPI[sym].getEventsubSubscriptions()
            .then(resolve)
            .catch(e => {
            return reject(Error("Could not get eventsub subscriptions from API", { "cause": e }));
        });
    });
}
exports.getSubscriptions = getSubscriptions;
;
