import { oberknechtAPIOptionsType } from "oberknecht-api/lib-ts/types/oberknechtAPIOptions";
export declare type eventsubClientOptions = {
    token: string;
    withStreamInformation?: boolean;
    subscribeDelay?: number;
    oberknechtAPIOptions?: oberknechtAPIOptionsType;
};
