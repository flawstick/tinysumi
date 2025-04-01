import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert UTC to Jerusalem time for input
export function toJerusalemTime(date: string) {
  if (!date) return "";
  const d = new Date(date);
  return formatInTimeZone(d, "Asia/Jerusalem", "yyyy-MM-dd'T'HH:mm");
}

// Convert Jerusalem time to UTC for storage
export function toUTC(date: string) {
  if (!date) return "";
  const jerusalemDate = toZonedTime(date, "Asia/Jerusalem");
  return jerusalemDate.toISOString().slice(0, 16);
}
