"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageTypes = void 0;
const stream_online_1 = require("./notifications/stream.online");
const sessionWelcome_1 = require("./sessionWelcome");
class messageTypes {
    static session_welcome = sessionWelcome_1.sessionWelcomeMessage;
    static notifications = class {
        static stream_online = stream_online_1.streamOnlineMessage;
    };
}
exports.messageTypes = messageTypes;
