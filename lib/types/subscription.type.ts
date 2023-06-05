import messageTypes from "./eventsub.subscriptiontypes";

export type subscriptionType = typeof messageTypes[number][1];