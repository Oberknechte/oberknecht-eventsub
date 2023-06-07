import { oberknechtAPI } from "oberknecht-api";
import { oberknechtEmitter } from "oberknecht-emitters";
import { eventsubClientOptions } from "../types/eventsub.client.options";
export declare class oberknechtEventsub {
    #private;
    get symbol(): string;
    get clientData(): any;
    get clientWebsockets(): any;
    get clientWebsocketData(): any;
    get _options(): any;
    get WebSockets(): any;
    OberknechtEmitter: oberknechtEmitter;
    OberknechtAPI: oberknechtAPI;
    constructor(options: eventsubClientOptions);
    connect(): Promise<void>;
    on: (eventName: any, callback: any) => void;
    once: (eventName: any, callback: any) => void;
    closeWebsocket: (wsNum: any) => any;
    closeWebsockets: () => void;
    /** @param {onStreamOnlineCallback} callback */
    onStreamOnline(callback: any): Promise<void>;
    subscribe(type: any, condition: any): Promise<import("oberknecht-api/lib-js/types/endpoints/eventsub").getEventsubSubscriptionsResponse>;
    unsubscribe(id: any): Promise<void>;
    unsubscribeAll(): Promise<void>;
    getSubscriptions(cacheOnly: any, wsNum: any): Promise<import("oberknecht-api/lib-js/types/endpoints/eventsub").getEventsubSubscriptionsResponse>;
    /** @param {Array<string> | string} broadcasters */
    subscribeToStreamOnline(broadcasters: any): Promise<unknown>;
}
