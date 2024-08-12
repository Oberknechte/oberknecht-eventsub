import { i } from "..";

export function unsubscribe(sym: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    let wsSubscription = i.eventsubClientData[sym]?.subscriptions?.[id];
    let wsNum = wsSubscription?.wsNum;

    i.OberknechtAPI[sym]
      .deleteEventsubSubscription(id)
      .then(() => {
        if (wsNum) {
          delete i.eventsubClientData[sym].subscriptions[id];

          delete i.websocketData[sym]?.[wsNum]?.subscriptions?.[id];
        }

        return resolve();
      })
      .catch((e) => {
        return reject(Error("Could not unsubscribe from event", { cause: e }));
      });
  });
}
