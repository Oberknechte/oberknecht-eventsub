import { i } from "..";
import { closeWebsocket } from "./closeWebsocket";

export function closeWebsockets(sym: string) {
  Object.keys(i.WebSockets[sym] ?? {}).forEach((wsnum) => {
    closeWebsocket(sym, parseInt(wsnum));
  });

  i.eventsubClientData[sym].subscriptions = {};
}
