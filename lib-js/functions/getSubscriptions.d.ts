import { getEventsubSubscriptionsResponse } from "oberknecht-api/lib-js/types/endpoints/eventsub";
export declare function getSubscriptions(sym: string, cachedOnly?: boolean, wsNum?: number): Promise<getEventsubSubscriptionsResponse>;
