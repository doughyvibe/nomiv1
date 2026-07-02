import { crc16 } from "./crc16";
import { formatNestedTlv, formatTlv } from "./tlv";
import type { BuildPayNowPayloadInput, PayNowProxyType } from "./types";

const MERCHANT_CITY = "Singapore";
const CURRENCY_SGD = "702";
const COUNTRY_SG = "SG";
const PAYNOW_GUID = "SG.PAYNOW";
const MAX_REFERENCE_LEN = 25;
const MAX_MERCHANT_NAME_LEN = 25;

export function normalizeSgMobile(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 8) return `+65${digits}`;
  if (digits.length === 10 && digits.startsWith("65")) return `+${digits}`;
  if (trimmed.startsWith("+65") && digits.length === 10) return `+${digits}`;

  throw new Error(
    "Invalid Singapore mobile. Use 8 digits (91234567) or +6591234567.",
  );
}

export function normalizeProxyValue(
  proxyType: PayNowProxyType,
  proxyValue: string,
): string {
  const value = proxyValue.trim();
  if (!value) throw new Error("Proxy value is required");

  if (proxyType === "mobile") return normalizeSgMobile(value);
  return value.toUpperCase();
}

export function formatPayNowAmount(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }
  return amount.toFixed(2);
}

function assertReference(reference: string): string {
  const ref = reference.trim();
  if (!ref) throw new Error("Reference is required");
  if (ref.length > MAX_REFERENCE_LEN) {
    throw new Error(`Reference must be at most ${MAX_REFERENCE_LEN} characters`);
  }
  if (!/^[A-Za-z0-9-]+$/.test(ref)) {
    throw new Error("Reference must be alphanumeric (hyphens allowed)");
  }
  return ref;
}

function assertMerchantName(name: string | undefined): string {
  const merchant = (name?.trim() || "NA").slice(0, MAX_MERCHANT_NAME_LEN);
  return merchant;
}

function assertExpiry(expiry: string | undefined): string | undefined {
  if (!expiry) return undefined;
  const value = expiry.trim();
  if (!/^\d{8}(\d{6})?$/.test(value)) {
    throw new Error("Expiry must be YYYYMMDD or YYYYMMDDHHMMSS");
  }
  return value;
}

function buildMerchantAccountInformation(
  proxyType: PayNowProxyType,
  proxyValue: string,
  editable: boolean,
  expiry?: string,
): string {
  const subfields = [
    formatTlv("00", PAYNOW_GUID),
    formatTlv("01", proxyType === "mobile" ? "0" : "2"),
    formatTlv("02", proxyValue),
    formatTlv("03", editable ? "1" : "0"),
  ];

  if (expiry) subfields.push(formatTlv("04", expiry));

  return formatNestedTlv("26", subfields);
}

/** Build an EMVCo PayNow (SGQR) payload string with CRC. */
export function buildPayNowPayload(input: BuildPayNowPayloadInput): string {
  const proxyValue = normalizeProxyValue(input.proxyType, input.proxyValue);
  const amount = formatPayNowAmount(input.amount);
  const reference = assertReference(input.reference);
  const merchantName = assertMerchantName(input.merchantName);
  const expiry = assertExpiry(input.expiry);
  const editable = input.editable ?? false;

  const parts = [
    formatTlv("00", "01"),
    formatTlv("01", "12"), // dynamic QR per order
    buildMerchantAccountInformation(
      input.proxyType,
      proxyValue,
      editable,
      expiry,
    ),
    formatTlv("52", "0000"),
    formatTlv("53", CURRENCY_SGD),
    formatTlv("54", amount),
    formatTlv("58", COUNTRY_SG),
    formatTlv("59", merchantName),
    formatTlv("60", MERCHANT_CITY),
    formatNestedTlv("62", [formatTlv("01", reference)]),
  ];

  const withoutCrc = `${parts.join("")}6304`;
  const checksum = crc16(withoutCrc);
  return `${withoutCrc}${checksum}`;
}
