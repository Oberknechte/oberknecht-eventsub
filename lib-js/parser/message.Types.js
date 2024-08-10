"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageTypes = void 0;
const channel_moderate_v2_1 = require("./notifications/channel.moderate.v2");
const stream_online_1 = require("./notifications/stream.online");
const sessionWelcome_1 = require("./sessionWelcome");
class messageTypes {
    static session_welcome = sessionWelcome_1.sessionWelcomeMessage;
    static notifications = class {
        static stream_online = stream_online_1.streamOnlineMessage;
        static channel_moderate_v2 = channel_moderate_v2_1.channelModerateMessagev2;
    };
}
exports.messageTypes = messageTypes;
