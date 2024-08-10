import { subscriptionTransportType } from "../eventsub";
declare const channelModerateActionTypes: readonly ["ban", "timeout", "unban", "untimeout", "clear", "emoteonly", "emoteonlyoff", "followers", "followersoff", "uniquechat", "uniquechatoff", "slow", "slowoff", "subscribers", "subscribersoff", "unraid", "delete", "unvip", "vip", "raid", "add_blocked_term", "add_permitted_term", "remove_blocked_term", "remove_permitted_term", "mod", "unmod", "approve_unban_request", "deny_unban_request", "warn"];
type channelModerateActionUserType = {
    user_id: string;
    user_login: string;
    user_name: string;
};
export type channelModerateResponse = {
    metadata: {
        message_id: string;
        message_type: "notification";
        message_timestamp: string;
        subscription_type: "channel.moderate";
        subscription_version: "1" | "2";
    };
    payload: {
        subscription: {
            id: string;
            status: string;
            type: "channel.moderate";
            version: "1" | "2";
            condition: {
                broadcaster_user_id: string;
                moderator_user_id: string;
            };
            transport: subscriptionTransportType;
            created_at: string;
        };
        event: channelModerateEvent;
    };
};
export type channelModerateEvent = {
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    moderator_user_id: string;
    moderator_user_login: string;
    moderator_user_name: string;
    action: typeof channelModerateActionTypes[number];
    followers: null | {
        follow_duration_minutes: number;
    };
    slow: null | {
        wait_time_seconds: number;
    };
    vip: null | channelModerateActionUserType;
    unvip: null | channelModerateActionUserType;
    mod: null | channelModerateActionUserType;
    unmod: null | channelModerateActionUserType;
    ban: null | channelModerateActionUserType;
    unban: null | channelModerateActionUserType;
    timeout: null | (channelModerateActionUserType & {
        reason?: string;
        expires_at: string;
    });
    untimeout: null | channelModerateActionUserType;
    raid: null | (channelModerateActionUserType & {
        viewer_count: number;
    });
    unraid: null | channelModerateActionUserType;
    delete: null | (channelModerateActionUserType & {
        message_id: string;
        message_body: string;
    });
    automod_terms: null | {
        action: "add" | "remove";
        list: "blocked" | "permitted";
        terms: string[];
        from_automod: boolean;
    };
    unban_request: null | (channelModerateActionUserType & {
        is_approved: boolean;
        moderator_message: string;
    });
    warn: null | (channelModerateActionUserType & {
        reason?: string;
        chat_rules_cited?: string[];
    });
};
export {};
