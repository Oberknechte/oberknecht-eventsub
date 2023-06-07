export declare class sessionWelcomeMessage {
    metadata: {
        messageID: string;
        messageType: string;
        messageTimestamp: string;
    };
    payload: {
        session: {
            id: string;
            status: string;
            connectedAt: string;
            keepaliveTimeoutSeconds: number;
            reconnectUrl: string;
        };
    };
    constructor(sym: any, wsNum: any, response: any);
}
