"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageParser = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
const message_Types_1 = require("./message.Types");
function messageParser(sym, response, wsNum) {
    const messageType = response.metadata.message_type;
    const responseParsed = ((message_Types_1.messageTypes[messageType] && (0, oberknecht_utils_1.isConstructor)(message_Types_1.messageTypes[messageType])) ? new message_Types_1.messageTypes[messageType](sym, wsNum, response) : undefined);
    __1.i.OberknechtEmitter[sym].emit([`ws:${messageType}`, messageType], (responseParsed ?? response));
    switch (messageType) {
        case "session_welcome":
            {
                __1.i.websocketData[sym][wsNum].sessionData = response.payload.session;
                __1.i.OberknechtEmitter[sym].emit([`ws:${wsNum}:session_welcome`, "session_welcome", "sessionwelcome"], (responseParsed ?? response));
                break;
            }
            ;
        case "notification":
            {
                const notificationTypeRaw = response.metadata.subscription_type;
                const notificationType = notificationTypeRaw.replace(/\./g, "_");
                const notificationParsed = ((message_Types_1.messageTypes["notifications"][notificationType] && (0, oberknecht_utils_1.isConstructor)(message_Types_1.messageTypes["notifications"][notificationType])) ? new message_Types_1.messageTypes["notifications"][notificationType](sym, wsNum, response) : undefined);
                __1.i.OberknechtEmitter[sym].emit([`notification:${notificationType}`, `notification:${notificationTypeRaw}`], (notificationParsed ?? response));
                break;
            }
            ;
        default:
            { }
            ;
    }
    ;
}
exports.messageParser = messageParser;
;
