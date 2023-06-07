/** @see https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/ */

export const messageTypes = [
    [
        "Channel Update",
        "channel.update",
        "1",
        "A broadcaster updates their channel properties e.g., category, title, mature flag, broadcast, or language."
    ],
    [
        "Channel Follow",
        "channel.follow",
        "2",
        "A specified channel receives a follow."
    ],
    [
        "Channel Subscribe",
        "channel.subscribe",
        "1",
        "A notification when a specified channel receives a subscriber. This does not include resubscribes."
    ],
    [
        "Channel Subscription End",
        "channel.subscription.end",
        "1",
        "A notification when a subscription to the specified channel ends."
    ],
    [
        "Channel Subscription Gift",
        "channel.subscription.gift",
        "1",
        "A notification when a viewer gives a gift subscription to one or more users in the specified channel."
    ],
    [
        "Channel Subscription Message",
        "channel.subscription.message",
        "1",
        "A notification when a user sends a resubscription chat message in a specific channel."
    ],
    [
        "Channel Cheer",
        "channel.cheer",
        "1",
        "A user cheers on the specified channel."
    ],
    [
        "Channel Raid",
        "channel.raid",
        "1",
        "A broadcaster raids another broadcaster’s channel."
    ],
    [
        "Channel Ban",
        "channel.ban",
        "1",
        "A viewer is banned from the specified channel."
    ],
    [
        "Channel Unban",
        "channel.unban",
        "1",
        "A viewer is unbanned from the specified channel."
    ],
    [
        "Channel Moderator Add",
        "channel.moderator.add",
        "1",
        "Moderator privileges were added to a user on a specified channel."
    ],
    [
        "Channel Moderator Remove",
        "channel.moderator.remove",
        "1",
        "Moderator privileges were removed from a user on a specified channel."
    ],
    [
        "BETA Channel Guest Star Session Begin",
        "channel.guest_star_session.begin",
        "beta",
        "The host began a new Guest Star session."
    ],
    [
        "BETA Channel Guest Star Session End",
        "channel.guest_star_session.end",
        "beta",
        "A running Guest Star session has ended."
    ],
    [
        "BETA Channel Guest Star Guest Update",
        "channel.guest_star_guest.update",
        "beta",
        "A guest has moved between interaction states in an active Guest Star session."
    ],
    [
        "BETA Channel Guest Star Slot Update",
        "channel.guest_star_slot.update",
        "beta",
        "A slot setting has been updated in an active Guest Star session."
    ],
    [
        "BETA Channel Guest Star Settings Update",
        "channel.guest_star_settings.update",
        "beta",
        "The host preferences for Guest Star have been updated."
    ],
    [
        "Channel Points Custom Reward Add",
        "channel.channel_points_custom_reward.add",
        "1",
        "A custom channel points reward has been created for the specified channel."
    ],
    [
        "Channel Points Custom Reward Update",
        "channel.channel_points_custom_reward.update",
        "1",
        "A custom channel points reward has been updated for the specified channel."
    ],
    [
        "Channel Points Custom Reward Remove",
        "channel.channel_points_custom_reward.remove",
        "1",
        "A custom channel points reward has been removed from the specified channel."
    ],
    [
        "Channel Points Custom Reward Redemption Add",
        "channel.channel_points_custom_reward_redemption.add",
        "1",
        "A viewer has redeemed a custom channel points reward on the specified channel."
    ],
    [
        "Channel Points Custom Reward Redemption Update",
        "channel.channel_points_custom_reward_redemption.update",
        "1",
        "A redemption of a channel points custom reward has been updated for the specified channel."
    ],
    [
        "Channel Poll Begin",
        "channel.poll.begin",
        "1",
        "A poll started on a specified channel."
    ],
    [
        "Channel Poll Progress",
        "channel.poll.progress",
        "1",
        "Users respond to a poll on a specified channel."
    ],
    [
        "Channel Poll End",
        "channel.poll.end",
        "1",
        "A poll ended on a specified channel."
    ],
    [
        "Channel Prediction Begin",
        "channel.prediction.begin",
        "1",
        "A Prediction started on a specified channel."
    ],
    [
        "Channel Prediction Progress",
        "channel.prediction.progress",
        "1",
        "Users participated in a Prediction on a specified channel."
    ],
    [
        "Channel Prediction Lock",
        "channel.prediction.lock",
        "1",
        "A Prediction was locked on a specified channel."
    ],
    [
        "Channel Prediction End",
        "channel.prediction.end",
        "1",
        "A Prediction ended on a specified channel."
    ],
    [
        "Charity Donation",
        "channel.charity_campaign.donate",
        "1",
        "Sends an event notification when a user donates to the broadcaster’s charity campaign."
    ],
    [
        "Charity Campaign Start",
        "channel.charity_campaign.start",
        "1",
        "Sends an event notification when the broadcaster starts a charity campaign."
    ],
    [
        "Charity Campaign Progress",
        "channel.charity_campaign.progress",
        "1",
        "Sends an event notification when progress is made towards the campaign’s goal or when the broadcaster changes the fundraising goal."
    ],
    [
        "Charity Campaign Stop",
        "channel.charity_campaign.stop",
        "1",
        "Sends an event notification when the broadcaster stops a charity campaign."
    ],
    [
        "Drop Entitlement Grant",
        "drop.entitlement.grant",
        "1",
        "An entitlement for a Drop is granted to a user."
    ],
    [
        "Extension Bits Transaction Create",
        "extension.bits_transaction.create",
        "1",
        "A Bits transaction occurred for a specified Twitch Extension."
    ],
    [
        "Goal Begin",
        "channel.goal.begin",
        "1",
        "Get notified when a broadcaster begins a goal."
    ],
    [
        "Goal Progress",
        "channel.goal.progress",
        "1",
        "Get notified when progress (either positive or negative) is made towards a broadcaster’s goal."
    ],
    [
        "Goal End",
        "channel.goal.end",
        "1",
        "Get notified when a broadcaster ends a goal."
    ],
    [
        "Hype Train Begin",
        "channel.hype_train.begin",
        "1",
        "A Hype Train begins on the specified channel."
    ],
    [
        "Hype Train Progress",
        "channel.hype_train.progress",
        "1",
        "A Hype Train makes progress on the specified channel."
    ],
    [
        "Hype Train End",
        "channel.hype_train.end",
        "1",
        "A Hype Train ends on the specified channel."
    ],
    [
        "Shield Mode Begin",
        "channel.shield_mode.begin",
        "1",
        "Sends a notification when the broadcaster activates Shield Mode."
    ],
    [
        "Shield Mode End",
        "channel.shield_mode.end",
        "1",
        "Sends a notification when the broadcaster deactivates Shield Mode."
    ],
    [
        "Shoutout Create",
        "channel.shoutout.create",
        "1",
        "Sends a notification when the specified broadcaster sends a Shoutout."
    ],
    [
        "Shoutout Received",
        "channel.shoutout.receive",
        "1",
        "Sends a notification when the specified broadcaster receives a Shoutout."
    ],
    [
        "Stream Online",
        "stream.online",
        "1",
        "The specified broadcaster starts a stream."
    ],
    [
        "Stream Offline",
        "stream.offline",
        "1",
        "The specified broadcaster stops a stream."
    ],
    [
        "User Authorization Grant",
        "user.authorization.grant",
        "1",
        "A user’s authorization has been granted to your client id."
    ],
    [
        "User Authorization Revoke",
        "user.authorization.revoke",
        "1",
        "A user’s authorization has been revoked for your client id."
    ],
    [
        "User Update",
        "user.update",
        "1",
        "A user has updated their account."
    ]
] as const;