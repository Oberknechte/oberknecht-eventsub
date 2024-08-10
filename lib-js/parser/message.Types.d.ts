import { channelModerateMessagev2 } from "./notifications/channel.moderate.v2";
import { streamOnlineMessage } from "./notifications/stream.online";
import { sessionWelcomeMessage } from "./sessionWelcome";
export declare class messageTypes {
    static session_welcome: typeof sessionWelcomeMessage;
    static notifications: {
        new (): {};
        stream_online: typeof streamOnlineMessage;
        channel_moderate_v2: typeof channelModerateMessagev2;
    };
}
