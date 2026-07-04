/** SG mobile: 8 digits starting with 8 or 9 */
export function isValidCustomerPhone(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("65") ? digits.slice(2) : digits;
  return /^[89]\d{7}$/.test(local);
}

export function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}
