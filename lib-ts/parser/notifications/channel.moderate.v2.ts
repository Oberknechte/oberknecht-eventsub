import { i } from "../..";
import { channelModerateResponse } from "../../types/endpoints/channel.moderate";

const channelModerateActionUserType = {
  user_id: String(),
  user_login: String(),
  user_name: String(),
};

export class channelModerateMessagev2 {
  #sym;
  #wsNum;

  broadcasterID = String();
  broadcasterLogin = String();
  broadcasterUserName = String();

  moderatorID = String();
  moderatorLogin = String();
  moderatorUserName = String();

  moderatorAction = String();

  moderatorActionParams = Object();

  metadata = {
    messageID: String(),
    messageType: "notification",
    messageTimestamp: String(),
    subscriptionType: "channel.moderate",
    subscriptionVersion: "1",
  };

  payload = {
    subscription: {
      id: String(),
      status: String(),
      type: "channel.moderate",
      version: "1" || "2",
      condition: Object,
      transport: Object,
      created_at: String(),
      cost: 0,
    },
    event: {
      broadcaster_user_id: String(),
      broadcaster_user_login: String(),
      broadcaster_user_name: String(),
      moderator_user_id: String(),
      moderator_user_login: String(),
      moderator_user_name: String(),
      action: String(),
      followers: null || {
        follow_duration_minutes: Number(),
      },
      slow: null || {
        wait_time_seconds: Number(),
      },
      vip: null || channelModerateActionUserType,
      unvip: null || channelModerateActionUserType,
      mod: null || channelModerateActionUserType,
      unmod: null || channelModerateActionUserType,
      ban: null || channelModerateActionUserType,
      unban: null || channelModerateActionUserType,
      timeout: null || {
        ...channelModerateActionUserType,
        reason: String(),
        expires_at: String(),
      },
      untimeout: null || channelModerateActionUserType,
      raid: null || {
        ...channelModerateActionUserType,
        viewer_count: Number(),
      },
      unraid: null || channelModerateActionUserType,
      delete: null || {
        ...channelModerateActionUserType,
        message_id: String(),
        message_body: String(),
      },
      automod_terms: null || {
        action: "add" || "remove",
        list: "blocked" || "permitted",
        terms: Array<String>(),
        from_automod: Boolean(),
      },
      unban_request: null || {
        ...channelModerateActionUserType,
        is_approved: Boolean(),
        moderator_message: String(),
      },
      warn: null || {
        ...channelModerateActionUserType,
        reason: String(),
        chat_rules_cited: Array<String>(),
      },
    },
  };

  constructor(sym: string, wsNum: number, response: channelModerateResponse) {
    this.#sym = sym;
    this.#wsNum = wsNum;

    if (!response) throw Error("response is undefined");

    // @ts-ignore
    this.metadata = response.metadata;

    // @ts-ignore
    this.payload = response.payload;

    this.broadcasterID = response.payload.event.broadcaster_user_id;
    this.broadcasterLogin = response.payload.event.broadcaster_user_login;
    this.broadcasterUserName = response.payload.event.broadcaster_user_name;

    this.moderatorID = response.payload.event.moderator_user_id;
    this.moderatorLogin = response.payload.event.moderator_user_login;
    this.moderatorUserName = response.payload.event.moderator_user_name;

    this.moderatorAction = response.payload.event.action;

    this.moderatorActionParams = response.payload.event[this.payload.event.action];
  }
}
