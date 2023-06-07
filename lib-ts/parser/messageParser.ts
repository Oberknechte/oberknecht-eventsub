import { isConstructor } from "oberknecht-utils";
import { i } from "..";
import { messageTypes } from "./message.Types";

export function messageParser(sym: string, response: Record<string, any>, wsNum: string) {
    const messageType = response.metadata.message_type;
    const responseParsed = ((messageTypes[messageType] && isConstructor(messageTypes[messageType])) ? new messageTypes[messageType](sym, wsNum, response) : undefined);
    i.OberknechtEmitter[sym].emit([`ws:${messageType}`, messageType], (responseParsed ?? response));

    switch (messageType) {
        case "session_welcome": {
            i.websocketData[sym][wsNum].sessionData = response.payload.session;

            i.OberknechtEmitter[sym].emit([`ws:${wsNum}:session_welcome`, "session_welcome", "sessionwelcome"], (responseParsed ?? response));

            break;
        };

        case "notification": {
            const notificationTypeRaw = response.metadata.subscription_type;
            const notificationType = notificationTypeRaw.replace(/\./g, "_");
            const notificationParsed = ((messageTypes["notifications"][notificationType] && isConstructor(messageTypes["notifications"][notificationType])) ? new messageTypes["notifications"][notificationType](sym, wsNum, response) : undefined);

            i.OberknechtEmitter[sym].emit([`notification:${notificationType}`, `notification:${notificationTypeRaw}`], (notificationParsed ?? response));

            break;
        };

        default: { };
    };
};