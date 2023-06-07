import { i } from "..";

export function unsubscribe(sym: string, id: string) {
    return new Promise<void>((resolve, reject) => {
        let wsSubscription = i.eventsubClientData[sym].subscriptions?.filter(a => a.id === id)?.[0];
        let wsNum = wsSubscription?.wsNum;

        i.OberknechtAPI[sym].deleteEventsubSubscription(id)
            .then(() => {
                if (wsNum) {
                    let subscriptionIndex = i.eventsubClientData[sym].subscriptions.indexOf(wsSubscription);
                    if (subscriptionIndex !== -1) i.eventsubClientData[sym].subscriptions.splice(subscriptionIndex, 1);

                    let wsSubscriptionIndex = i.websocketData[sym][wsNum].subscriptions.indexOf(wsSubscription);
                    if ((wsSubscriptionIndex !== -1) && i.websocketData[sym][wsNum].subscriptions) i.websocketData[sym][wsNum].subscriptions.splice(wsSubscriptionIndex, 1);
                };

                return resolve();
            })
            .catch(e => {
                return reject(Error("Could not unsubscribe from event", { "cause": e }));
            });
    });
};