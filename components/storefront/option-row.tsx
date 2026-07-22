import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type OptionRowProps = {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  /** Right-side meta: fee, “Sold out”, etc. */
  meta?: string;
  className?: string;
};

/** Full-width selectable row for PDP choices / customisations (mobile-first). */
export function OptionRow({
  active,
  disabled = false,
  onClick,
  label,
  meta,
  className,
}: OptionRowProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "option-row flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border px-3.5 text-left text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibe-primary",
        disabled && "option-row-disabled",
        !disabled && active && "option-row-active",
        !disabled && !active && "option-row-inactive",
        className,
      )}
    >
      <span className={cn("min-w-0 flex-1", disabled && "line-through")}>
        {label}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {meta ? (
          <span className="text-xs font-normal opacity-80">{meta}</span>
        ) : null}
        <span
          aria-hidden
          className={cn(
            "flex size-5 items-center justify-center rounded-full border",
            active && !disabled
              ? "border-transparent bg-vibe-primary-fg/20"
              : "border-current opacity-35",
          )}
        >
          {active && !disabled ? <Check className="size-3" strokeWidth={2.5} /> : null}
        </span>
      </span>
    </button>
  );
}
