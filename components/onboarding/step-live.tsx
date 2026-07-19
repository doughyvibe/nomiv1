"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function StepLive() {
  return (
    <section className="flex flex-col items-center gap-8 text-center">
      <div className="flex flex-col items-center gap-1">
        <span className="text-6xl leading-none" aria-hidden>
          🎉
        </span>
        <h1 className="font-display text-[2rem] font-extrabold tracking-[-0.02em] sm:text-[2.5rem]">
          Great start!
        </h1>
      </div>

      <p className="max-w-md text-xl leading-snug font-medium text-foreground sm:text-2xl">
        Your store foundation is ready.
        <br />
        Now let&apos;s make it something you&apos;ll be excited to share with
        customers.
      </p>

      <Button
        render={<Link href="/" />}
        className="rounded-full px-10"
        size="lg"
      >
        Continue to dashboard
      </Button>
    </section>
  );
}
