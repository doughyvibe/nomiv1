import { crc16 } from "./crc16";

/** Validate the trailing CRC on an EMVCo PayNow payload string. */
export function validatePayloadCrc(payload: string): boolean {
  if (payload.length < 8) return false;
  if (!payload.endsWith("6304") && !payload.includes("6304")) return false;

  const provided = payload.slice(-4).toUpperCase();
  const base = payload.slice(0, -4);
  if (!base.endsWith("6304")) return false;

  return crc16(base) === provided;
}

export function extractPayloadCrc(payload: string): {
  base: string;
  provided: string;
  computed: string;
} {
  const provided = payload.slice(-4).toUpperCase();
  const base = payload.slice(0, -4);
  return { base, provided, computed: crc16(base) };
}
