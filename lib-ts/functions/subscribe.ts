import { getEventsubSubscriptionsResponse } from "oberknecht-api/lib-js/types/endpoints/eventsub";
import { i } from "..";
import { subscriptionType } from "../types/subscription.type";
import { createWs } from "./createWs";
import { getFreeWsNum } from "./getFreeWsNum";

let creatingWsPromise;
let creatingWS = false;

export async function subscribe(sym: string, type: subscriptionType, condition: string, transport?: object) {
    return new Promise<getEventsubSubscriptionsResponse>(async (resolve, reject) => {
        if (creatingWS) await creatingWsPromise;
        let wsNum = getFreeWsNum(sym);
        if (wsNum === undefined) {
            creatingWS = true;

            creatingWsPromise = new Promise(async (resolve, reject) => {
                wsNum = await createWs(sym)
                    .then(resolve)
                    .catch(reject);
            });

            wsNum = await creatingWsPromise;

            creatingWS = false;
        };

        let wsData = i.websocketData[sym][wsNum];

        let transport_ = (transport ?? {
            method: "websocket",
            session_id: i.websocketData?.[sym]?.[wsNum]?.sessionData?.id
        });

        await i.OberknechtAPI[sym].addEventsubSubscription(type, undefined, condition, transport_)
            .then(subscription => {
                i.eventsubClientData[sym].totalSubscriptions = subscription.total;
                i.eventsubClientData[sym].totalCost = subscription.total_cost;
                let subscriptionParsed = {
                    ...subscription.data[0],
                    wsNum: wsNum
                };

                if (!i.eventsubClientData[sym].subscriptions) i.eventsubClientData[sym].subscriptions = [];
                i.eventsubClientData[sym].subscriptions.push(subscriptionParsed);

                wsData.subscriptions.push(subscriptionParsed);

                return resolve(subscription);
            })
            .catch(e => {
                i.OberknechtEmitter[sym].emitError(["ws:error:subscribe", `ws:${wsNum}:error:subscribe`], e);
                return reject(Error("Could not subscribe to event", { "cause": e }));
            });
    });
};