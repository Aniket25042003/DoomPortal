import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Client-safe utilities (no Node/MongoDB). Use for `cn()` in UI components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
