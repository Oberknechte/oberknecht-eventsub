import { getEventsubSubscriptionsResponse } from "oberknecht-api/lib-js/types/endpoints/eventsub";
import { subscriptionType } from "../types/subscription.type";
export declare function subscribe(sym: string, type: subscriptionType, condition: string, transport?: object): Promise<getEventsubSubscriptionsResponse>;
