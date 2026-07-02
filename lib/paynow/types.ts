export type PayNowProxyType = "mobile" | "uen";

export type BuildPayNowPayloadInput = {
  proxyType: PayNowProxyType;
  /** Mobile (+65…) or UEN string */
  proxyValue: string;
  /** Amount in SGD dollars, e.g. 0.5 → 0.50 */
  amount: number;
  /** Bill / order reference (max 25 chars) */
  reference: string;
  merchantName?: string;
  /** YYYYMMDD or YYYYMMDDHHMMSS */
  expiry?: string;
  /** Default false when amount is set */
  editable?: boolean;
};
