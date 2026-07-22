"use client";

import { ImageIcon, UploadCloud, X } from "lucide-react";
import { useId, useRef, useState } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ImageUploadFieldProps = {
  valueUrl: string;
  onFile: (file: File) => void | Promise<void>;
  onClear: () => void;
  uploading?: boolean;
  disabled?: boolean;
  label?: string;
  labelClassName?: string;
  emptyTitleMobile?: string;
  emptyTitleDesktop?: string;
  hint?: string;
  accept?: string;
  /** Preview fit when filled — logos usually contain, products cover */
  objectFit?: "contain" | "cover";
  id?: string;
};

export function ImageUploadField({
  valueUrl,
  onFile,
  onClear,
  uploading = false,
  disabled = false,
  label,
  labelClassName,
  emptyTitleMobile = "Tap to add an image",
  emptyTitleDesktop = "Drop an image or click to browse",
  hint = "JPG or PNG",
  accept = "image/*",
  objectFit = "contain",
  id: idProp,
}: ImageUploadFieldProps) {
  const autoId = useId();
  const inputId = idProp ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const locked = disabled || uploading;

  function pickFile(file: File | undefined) {
    if (!file || locked) return;
    if (!file.type.startsWith("image/")) return;
    void onFile(file);
  }

  function openPicker() {
    if (locked) return;
    inputRef.current?.click();
  }

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <Label htmlFor={inputId} className={labelClassName}>
          {label}
        </Label>
      ) : null}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={locked}
        onChange={(e) => {
          pickFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {valueUrl ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border bg-muted/30",
            locked && "opacity-60",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={valueUrl}
            alt=""
            className={cn(
              "mx-auto max-h-56 w-full min-h-[9rem]",
              objectFit === "cover" ? "object-cover" : "object-contain p-4",
            )}
          />
          <div className="flex items-center justify-between gap-3 border-t border-border bg-card/80 px-3 py-2.5">
            <button
              type="button"
              onClick={openPicker}
              disabled={locked}
              className="text-left text-sm font-medium text-foreground underline-offset-2 hover:underline disabled:pointer-events-none"
            >
              {uploading ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={locked}
              aria-label="Remove image"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-foreground/30 disabled:pointer-events-none disabled:opacity-50"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={locked}
          onDragEnter={(e) => {
            e.preventDefault();
            if (!locked) setDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!locked) setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex min-h-[11rem] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-4 py-8 text-center transition-colors",
            "border-border hover:border-primary/60 hover:bg-primary/5",
            "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 focus-visible:outline-none",
            dragging && "border-primary bg-primary/10",
            locked && "pointer-events-none opacity-60",
          )}
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-foreground">
            {uploading ? (
              <UploadCloud className="size-6 animate-pulse" strokeWidth={2} />
            ) : (
              <ImageIcon className="size-6" strokeWidth={2} />
            )}
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-foreground sm:hidden">
              {uploading ? "Uploading…" : emptyTitleMobile}
            </span>
            <span className="hidden text-lg font-semibold text-foreground sm:inline">
              {uploading ? "Uploading…" : emptyTitleDesktop}
            </span>
            {hint ? (
              <span className="text-base text-muted-foreground">{hint}</span>
            ) : null}
          </span>
        </button>
      )}
    </div>
  );
}
