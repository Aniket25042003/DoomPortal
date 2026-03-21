"use client";

import { SINS } from "@/data/sins";
import { cn } from "@/lib/utils";
import type { Sin } from "@/types";

interface SinSelectorProps {
  selectedSinId: string | null;
  onSelect: (sin: Sin) => void;
  disabled?: boolean;
}

const SIN_ICONS: Record<string, string> = {
  doom: "📱",
  crypto: "📈",
  meme: "😂",
  ratio: "👍",
  "3am": "🌙",
  selfie: "🤳",
  replyguy: "⌨️",
  story: "📖",
  flex: "💎",
  algo: "🔄",
  ghost: "👻",
  poll: "📊",
};

export function SinSelector({
  selectedSinId,
  onSelect,
  disabled = false,
}: SinSelectorProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {SINS.map((sin) => (
        <button
          key={sin.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(sin)}
          className={cn(
            "flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
            "hover:border-primary/50 hover:bg-primary/5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selectedSinId === sin.id
              ? "border-primary bg-primary/10 ring-1 ring-primary/30"
              : "border-border bg-card",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <span className="text-2xl" role="img" aria-hidden>
            {SIN_ICONS[sin.id] ?? "😈"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-heading font-semibold text-foreground">
              {sin.name}
            </p>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {sin.visual}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
