import { getEventsubSubscriptionsResponse } from "oberknecht-api/lib-js/types/endpoints/eventsub";
import { i } from "..";
import { subscriptionType } from "../types/subscription.type";
import { createWs } from "./createWs";
import { getFreeWsNum } from "./getFreeWsNum";
import { sleep } from "oberknecht-utils";

let creatingWsPromise = {};
let creatingWS = {};
let inQueue = {};

export async function subscribe(
  sym: string,
  type: subscriptionType,
  condition: string,
  transport?: object,
  version?: string
) {
  return new Promise<getEventsubSubscriptionsResponse>(
    async (resolve, reject) => {
      if (!inQueue[sym]) inQueue[sym] = 0;
      function getDelay(): number {
        return (
          inQueue[sym] *
          (i.eventsubClientData[sym]._options.subscribeDelay ?? 300)
        );
      }
      inQueue[sym]++;
      const myDelay = getDelay();
      await sleep(myDelay);
      inQueue[sym]--;

      if (creatingWS[sym]) await creatingWsPromise[sym];
      let wsNum = getFreeWsNum(sym);
      if (wsNum === undefined) {
        creatingWS[sym] = true;

        creatingWsPromise[sym] = new Promise(async (resolve, reject) => {
          await createWs(sym)
            .then((wsNum_) => {
              wsNum = wsNum_;
              resolve(wsNum_);
            })
            .catch(reject);
        });

        wsNum = await creatingWsPromise[sym];

        creatingWS[sym] = false;
      }

      let wsData = i.websocketData[sym][wsNum];

      let transport_ = transport ?? {
        method: "websocket",
        session_id: i.websocketData?.[sym]?.[wsNum]?.sessionData?.id,
      };

      await i.OberknechtAPI[sym]
        .addEventsubSubscription(type, version, condition, transport_)
        .then((subscription) => {
          i.eventsubClientData[sym].totalSubscriptions = subscription.total;
          i.eventsubClientData[sym].totalCost = subscription.total_cost;
          let subscriptionParsed = {
            ...subscription.data[0],
            wsNum: wsNum,
            wsArgs: [type, condition, transport, version],
          };

          if (!i.eventsubClientData[sym].subscriptions)
            i.eventsubClientData[sym].subscriptions = {};
          i.eventsubClientData[sym].subscriptions[
            subscription.data[0].id
          ] = subscriptionParsed;

          if (!wsData.subscriptions) wsData.subscriptions = {};
          wsData.subscriptions[subscription.data[0].id] = subscriptionParsed;

          return resolve(subscription);
        })
        .catch((e) => {
          i.OberknechtEmitter[sym].emitError(
            ["ws:error:subscribe", `ws:${wsNum}:error:subscribe`],
            e
          );
          return reject(Error("Could not subscribe to event", { cause: e }));
        });
    }
  );
}
