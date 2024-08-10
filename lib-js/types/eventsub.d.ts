import { eventsubSubscriptionVersionType } from "oberknecht-api/lib-js/types/endpoints/eventsub";
export declare const streamOnlineCondition: {
    broadcaster_user_id: string;
};
export type subscriptionType = {
    id: string;
    type: string;
    version: string;
    status: string;
    cost: number;
    condition: typeof streamOnlineCondition;
    transport: {
        method: "websocket" | "webhook";
        session_id: string;
    };
    created_at: string;
};
export type subscriptionTransportType = {
    method: "websocket" | "webhook";
    session_id?: string;
    callback?: string;
};
export type streamOnlineEvent = {
    id: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    type: string;
    started_at: string;
};
export type streamOnlineResponse = {
    metadata: {
        message_id: string;
        message_type: "notification";
        message_timestamp: string;
        subscription_type: "stream.online";
        subscription_version: eventsubSubscriptionVersionType;
    };
    payload: {
        subscription: subscriptionType;
        event: streamOnlineEvent;
    };
};
