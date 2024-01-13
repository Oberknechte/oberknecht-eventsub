import { oberknechtAPIOptionsType } from "oberknecht-api/lib-ts/types/oberknechtAPIOptions";

export type eventsubClientOptions = {
  token: string;
  withStreamInformation?: boolean;
  subscribeDelay?: number;
  oberknechtAPIOptions?: oberknechtAPIOptionsType;
};
