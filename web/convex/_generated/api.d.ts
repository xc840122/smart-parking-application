/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as address from "../address.js";
import type * as booking from "../booking.js";
import type * as iot from "../iot.js";
import type * as parking from "../parking.js";
import type * as payment from "../payment.js";
import type * as review from "../review.js";
import type * as seed from "../seed.js";
import type * as user from "../user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  address: typeof address;
  booking: typeof booking;
  iot: typeof iot;
  parking: typeof parking;
  payment: typeof payment;
  review: typeof review;
  seed: typeof seed;
  user: typeof user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
