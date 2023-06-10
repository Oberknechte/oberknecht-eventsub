import { i } from "..";

export function closeWebsocket(sym: string, wsnum: number) {
  try {
    i.WebSockets[sym][wsnum].close();
    if (i.websocketData[sym][wsnum].subscriptions)
      i.websocketData[sym][wsnum].subscriptions.forEach((subscription) => {
        let index = i.eventsubClientData[sym].subscriptions.indexOf(
          subscription
        );
        if (index !== -1) i.eventsubClientData[sym].subscriptions.splice(index);
      });
    i.websocketData[sym][wsnum].subscriptions = [];
  } catch (e) {}
  return;
}
