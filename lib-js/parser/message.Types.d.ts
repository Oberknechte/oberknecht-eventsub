import { streamOnlineMessage } from "./notifications/stream.online";
import { sessionWelcomeMessage } from "./sessionWelcome";
export declare class messageTypes {
    static session_welcome: typeof sessionWelcomeMessage;
    static notifications: {
        new (): {};
        stream_online: typeof streamOnlineMessage;
    };
}
