const sessionWelcomeMessage = require("./sessionWelcome");
const streamOnlineMessage = require("./notifications/stream.online");

class messageTypes {
    static session_welcome = sessionWelcomeMessage;
    static notifications = class {
        static stream_online = streamOnlineMessage;
    };
};

module.exports = messageTypes;