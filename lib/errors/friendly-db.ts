/** Map Supabase/Postgres errors to user-safe messages (Task 8.1). */
export function friendlyDbError(error: { message?: string } | null): string {
  if (!error?.message) return "Something went wrong. Please try again.";
  const msg = error.message.toLowerCase();
  if (msg.includes("duplicate") || msg.includes("unique")) {
    return "That value is already taken.";
  }
  if (msg.includes("violates") || msg.includes("constraint")) {
    return "Could not save — check your input and try again.";
  }
  return "Something went wrong. Please try again.";
}
