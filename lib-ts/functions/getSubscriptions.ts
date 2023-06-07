import { getEventsubSubscriptionsResponse } from "oberknecht-api/lib-js/types/endpoints/eventsub";
import { i } from "..";

export async function getSubscriptions(sym: string, cachedOnly?: boolean, wsNum?: number) {
    return new Promise<getEventsubSubscriptionsResponse>((resolve, reject) => {
        if (cachedOnly) {
            if (wsNum) return resolve((i.websocketData[sym][wsNum]?.subscriptions ?? []));
            return resolve((i.eventsubClientData[sym].subscriptions ?? []));
        };

        i.OberknechtAPI[sym].getEventsubSubscriptions()
            .then(resolve)
            .catch(e => {
                return reject(Error("Could not get eventsub subscriptions from API", { "cause": e }));
            });
    });
};