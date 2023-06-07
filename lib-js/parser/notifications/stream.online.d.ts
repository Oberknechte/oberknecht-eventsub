import { streamOnlineResponse } from "../../types/eventsub";
export declare class streamOnlineMessage {
    #private;
    broadcasterID: string;
    broadcasterLogin: string;
    broadcasterUserName: string;
    streamStart: string;
    streamType: string;
    metadata: {
        messageID: string;
        messageType: string;
        messageTimestamp: string;
        subscriptionType: string;
        subscriptionVersion: string;
    };
    payload: {
        subscription: {
            id: string;
            status: string;
            type: string;
            version: string;
            condition: {
                broadcasterUserID: string;
            };
            transport: {
                method: string;
                sessionID: string;
            };
            createdAt: string;
            cost: number;
        };
        event: {
            id: string;
            broadcasterUserID: string;
            broadcasterUserLogin: string;
            broadcasterUserName: string;
            type: string;
            startedAt: string;
        };
    };
    getStreamInformation(): Promise<any>;
    constructor(sym: string, wsNum: number, response: streamOnlineResponse);
}
