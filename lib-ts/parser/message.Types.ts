import { streamOnlineMessage } from "./notifications/stream.online";
import { sessionWelcomeMessage } from "./sessionWelcome";

export class messageTypes {
  static session_welcome = sessionWelcomeMessage;
  static notifications = class {
    static stream_online = streamOnlineMessage;
  };
}
