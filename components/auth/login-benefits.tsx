import { ClipboardList, Share2, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

const BENEFITS = [
  {
    Icon: Zap,
    tint: "bg-primary text-foreground",
    title: "Set up your store in minutes",
  },
  {
    Icon: Share2,
    tint: "bg-[var(--brand-purple-soft)] text-[var(--brand-purple)]",
    title: "Start selling across social media",
  },
  {
    Icon: ClipboardList,
    tint: "bg-[var(--brand-mint-soft)] text-[var(--brand-mint)]",
    title: "Manage orders and customers easily",
  },
] as const;

export function LoginBenefits({ className }: { className?: string }) {
  return (
    <ul className={cn("space-y-3.5", className)}>
      {BENEFITS.map((benefit) => (
        <li
          key={benefit.title}
          className="grid grid-cols-[2.5rem_1fr] items-center gap-x-3"
        >
          <span
            className={`flex size-10 items-center justify-center rounded-xl ${benefit.tint}`}
            aria-hidden
          >
            <benefit.Icon className="size-[18px]" strokeWidth={2} />
          </span>
          <p className="text-sm font-semibold leading-snug">{benefit.title}</p>
        </li>
      ))}
    </ul>
  );
}
