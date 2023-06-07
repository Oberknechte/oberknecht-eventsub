"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribe = void 0;
const __1 = require("..");
function unsubscribe(sym, id) {
    return new Promise((resolve, reject) => {
        let wsSubscription = __1.i.eventsubClientData[sym].subscriptions?.filter(a => a.id === id)?.[0];
        let wsNum = wsSubscription?.wsNum;
        __1.i.OberknechtAPI[sym].deleteEventsubSubscription(id)
            .then(() => {
            if (wsNum) {
                let subscriptionIndex = __1.i.eventsubClientData[sym].subscriptions.indexOf(wsSubscription);
                if (subscriptionIndex !== -1)
                    __1.i.eventsubClientData[sym].subscriptions.splice(subscriptionIndex, 1);
                let wsSubscriptionIndex = __1.i.websocketData[sym][wsNum].subscriptions.indexOf(wsSubscription);
                if ((wsSubscriptionIndex !== -1) && __1.i.websocketData[sym][wsNum].subscriptions)
                    __1.i.websocketData[sym][wsNum].subscriptions.splice(wsSubscriptionIndex, 1);
            }
            ;
            return resolve();
        })
            .catch(e => {
            return reject(Error("Could not unsubscribe from event", { "cause": e }));
        });
    });
}
exports.unsubscribe = unsubscribe;
;
