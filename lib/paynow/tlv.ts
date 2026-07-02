export function formatTlv(id: string, value: string): string {
  if (id.length !== 2) throw new Error(`Invalid TLV id: ${id}`);
  if (value.length > 99) throw new Error(`TLV value too long for id ${id}`);
  return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

export function formatNestedTlv(id: string, subfields: string[]): string {
  return formatTlv(id, subfields.join(""));
}
