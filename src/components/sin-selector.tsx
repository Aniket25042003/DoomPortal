"use client";

import { SINS } from "@/data/sins";
import { cn } from "@/lib/utils";
import type { Sin } from "@/types";

interface SinSelectorProps {
  selectedSinId: string | null;
  onSelect: (sin: Sin) => void;
  disabled?: boolean;
}

const SIN_CARDS: Record<string, { icon: string; tagline: string }> = {
  doom: { icon: "📱", tagline: "Your thumb deserves a vacation" },
  crypto: { icon: "📉", tagline: "Buy high, sell low, cry always" },
  meme: { icon: "🤡", tagline: "Your humor peaked in 2019" },
  ratio: { icon: "💀", tagline: "Terminally online & proud" },
  "3am": { icon: "🌙", tagline: "Sleep is for the weak (and sane)" },
  selfie: { icon: "🤳", tagline: "Mirror's #1 customer" },
  replyguy: { icon: "🤬", tagline: "Nobody asked, but here you are" },
  story: { icon: "🎬", tagline: "Broadcasting your lunch since 2016" },
  flex: { icon: "🧢", tagline: "Fake it till you fake it more" },
  algo: { icon: "🧟", tagline: "The algorithm owns you" },
  ghost: { icon: "👻", tagline: "Seen at 2:03 PM. It's now March." },
  poll: { icon: "📊", tagline: "Democracy was a mistake" },
};

export function SinSelector({
  selectedSinId,
  onSelect,
  disabled = false,
}: SinSelectorProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {SINS.map((sin) => {
        const card = SIN_CARDS[sin.id] ?? { icon: "😈", tagline: "" };
        return (
          <button
            key={sin.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(sin)}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all",
              "hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.03]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedSinId === sin.id
                ? "border-primary bg-primary/10 ring-1 ring-primary/30 scale-[1.03]"
                : "border-border bg-card",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <span className="text-3xl transition-transform group-hover:animate-wiggle" role="img" aria-hidden>
              {card.icon}
            </span>
            <p className="font-heading text-sm font-semibold text-foreground">
              {sin.name}
            </p>
            <p className="text-xs text-muted-foreground italic">
              {card.tagline}
            </p>
          </button>
        );
      })}
    </div>
  );
}
