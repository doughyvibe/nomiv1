/** Seller-facing PayNow input validation (Task 3.7 / PRD §16 Step 6). */

/** SG mobile: 8 digits starting with 8 or 9 (optionally +65-prefixed). */
export function isValidSgMobile(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("65") ? digits.slice(2) : digits;
  return /^[89]\d{7}$/.test(local);
}

/**
 * SG UEN formats: 8 digits + check letter (businesses), 9 digits + letter
 * (local companies), or [TSR]yy + 2 letters + 4 digits + letter (other entities).
 */
export function isValidUen(input: string): boolean {
  const uen = input.trim().toUpperCase();
  return (
    /^\d{8}[A-Z]$/.test(uen) ||
    /^\d{9}[A-Z]$/.test(uen) ||
    /^[TSR]\d{2}[A-Z]{2}\d{4}[A-Z]$/.test(uen)
  );
}
