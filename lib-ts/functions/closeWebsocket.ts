import { i } from "..";

export function closeWebsocket(sym: string, wsnum: number) {
  try {
    i.WebSockets[sym][wsnum].close();
    if (i.websocketData[sym][wsnum].subscriptions)
      Object.keys(i.websocketData[sym][wsnum].subscriptions).forEach((id) => {
        delete i.eventsubClientData[sym].subscriptions[id];
      });
      
    i.websocketData[sym][wsnum].subscriptions = [];
  } catch (e) {}
  return;
}
