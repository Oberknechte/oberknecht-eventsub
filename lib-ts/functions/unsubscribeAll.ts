import { i } from "..";
import { getSubscriptions } from "./getSubscriptions";
import { unsubscribe } from "./unsubscribe";

export function unsubscribeAll(sym: string) {
    return new Promise<void>((resolve, reject) => {
        getSubscriptions(sym)
            .then(async subscriptions => {
                await Promise.all(subscriptions.data.filter(a => a.status === "enabled").map(subscription => {
                    return new Promise((resolve2) => {
                        unsubscribe(sym, subscription.id)
                            .then(resolve2)
                            .catch(resolve2);
                    })
                }))
                    .then(() => {
                        i.eventsubClientData[sym].subscriptions = [];
                        Object.keys(i.websocketData[sym]).forEach(wsNum => {
                            i.websocketData[sym][wsNum].subscriptions = [];
                        });

                        resolve();
                    });
            })
            .catch(e => {
                return reject(Error("Could not get subscriptions from API", { "cause": e }));
            });
    });
};