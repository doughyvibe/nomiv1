import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const EXPECTED_TABLES = [
  "stores",
  "products",
  "orders",
  "order_items",
  "reserved_slugs",
] as const;

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message:
          "Supabase env vars missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local.",
      },
      { status: 503 },
    );
  }

  try {
    const supabase = await createClient();
    const { error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return NextResponse.json(
        { ok: false, configured: true, connected: false, message: sessionError.message },
        { status: 503 },
      );
    }

    const { count, error: slugError } = await supabase
      .from("reserved_slugs")
      .select("*", { count: "exact", head: true });

    if (slugError) {
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          connected: true,
          schema: false,
          message: slugError.message,
          hint: "Run supabase/migrations/20260702100000_initial_schema.sql in the Supabase SQL Editor.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      configured: true,
      connected: true,
      schema: true,
      tables: EXPECTED_TABLES,
      reserved_slug_count: count ?? 0,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Supabase error";

    return NextResponse.json(
      { ok: false, configured: true, message },
      { status: 503 },
    );
  }
}
