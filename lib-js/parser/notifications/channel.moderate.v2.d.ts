import { channelModerateResponse } from "../../types/endpoints/channel.moderate";
export declare class channelModerateMessagev2 {
    #private;
    broadcasterID: string;
    broadcasterLogin: string;
    broadcasterUserName: string;
    moderatorID: string;
    moderatorLogin: string;
    moderatorUserName: string;
    moderatorAction: string;
    moderatorActionParams: any;
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
            condition: ObjectConstructor;
            transport: ObjectConstructor;
            created_at: string;
            cost: number;
        };
        event: {
            broadcaster_user_id: string;
            broadcaster_user_login: string;
            broadcaster_user_name: string;
            moderator_user_id: string;
            moderator_user_login: string;
            moderator_user_name: string;
            action: string;
            followers: {
                follow_duration_minutes: number;
            };
            slow: {
                wait_time_seconds: number;
            };
            vip: {
                user_id: string;
                user_login: string;
                user_name: string;
            };
            unvip: {
                user_id: string;
                user_login: string;
                user_name: string;
            };
            mod: {
                user_id: string;
                user_login: string;
                user_name: string;
            };
            unmod: {
                user_id: string;
                user_login: string;
                user_name: string;
            };
            ban: {
                user_id: string;
                user_login: string;
                user_name: string;
            };
            unban: {
                user_id: string;
                user_login: string;
                user_name: string;
            };
            timeout: {
                reason: string;
                expires_at: string;
                user_id: string;
                user_login: string;
                user_name: string;
            };
            untimeout: {
                user_id: string;
                user_login: string;
                user_name: string;
            };
            raid: {
                viewer_count: number;
                user_id: string;
                user_login: string;
                user_name: string;
            };
            unraid: {
                user_id: string;
                user_login: string;
                user_name: string;
            };
            delete: {
                message_id: string;
                message_body: string;
                user_id: string;
                user_login: string;
                user_name: string;
            };
            automod_terms: {
                action: string;
                list: string;
                terms: String[];
                from_automod: boolean;
            };
            unban_request: {
                is_approved: boolean;
                moderator_message: string;
                user_id: string;
                user_login: string;
                user_name: string;
            };
            warn: {
                reason: string;
                chat_rules_cited: String[];
                user_id: string;
                user_login: string;
                user_name: string;
            };
        };
    };
    constructor(sym: string, wsNum: number, response: channelModerateResponse);
}
