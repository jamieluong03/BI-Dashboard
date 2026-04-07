import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { startOfDay, endOfDay, subDays, subMonths, subYears, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, setMonth, startOfYear } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatOrderId(uuid: string) {
  const shortId = uuid.split('-')[0].toUpperCase().slice(0, 4);
  return `INV-${shortId}`;
}

export const getSeasonalMultiplier = (date: Date) => {
  const month = date.getMonth();
  const day = date.getDate();

  // 1. Valentine's Day Peak (Feb 1 - Feb 14)
  if (month === 1 && day <= 14) return 2.5;
  
  // 2. Mother's Day Peak (Roughly May 1 - May 12)
  if (month === 4 && day <= 12) return 2.0;
  
  // 3. Black Friday / Cyber Monday (Late Nov)
  if (month === 10 && day >= 20) return 4.0;
  
  // 4. Christmas / Year End (Dec 10 - Dec 25)
  if (month === 11 && day >= 10 && day <= 25) return 3.0;

  // Default "Evergreen" multiplier
  return 1.0;
};

export const lastOrderDate = new Date("2026-03-27T00:17:29.997Z");

export const getRangePresets = (preset: string, referenceDate: Date = lastOrderDate) => {
  const now = referenceDate;
  
  switch (preset) {
    case "today":
      return { from: startOfDay(now).toISOString(), to: endOfDay(now).toISOString() };
    case "last_7":
      return { from: subDays(now, 7).toISOString(), to: now.toISOString() };
    case "last_30":
      return { from: subDays(now, 30).toISOString(), to: now.toISOString() };
    case "last_90":
      return { from: subDays(now, 90).toISOString(), to: now.toISOString() };
    case "last_month":
      const prev = subMonths(now, 1);
      return { from: startOfMonth(prev).toISOString(), to: endOfMonth(prev).toISOString() };
    case "last_year":
      return { from: subYears(now, 1).toISOString(), to: now.toISOString() };
    case "q1":
      // Jan 1 to Mar 31
      const q1Date = setMonth(startOfYear(now), 0);
      return { from: startOfQuarter(q1Date).toISOString(), to: endOfQuarter(q1Date).toISOString() };
    case "q2":
      // Apr 1 to Jun 30
      const q2Date = setMonth(startOfYear(now), 3);
      return { from: startOfQuarter(q2Date).toISOString(), to: endOfQuarter(q2Date).toISOString() };
    case "q3":
      // Jul 1 to Sep 30
      const q3Date = setMonth(startOfYear(now), 6);
      return { from: startOfQuarter(q3Date).toISOString(), to: endOfQuarter(q3Date).toISOString() };
    case "q4":
      // Oct 1 to Dec 31
      const q4Date = setMonth(startOfYear(now), 9);
      return { from: startOfQuarter(q4Date).toISOString(), to: endOfQuarter(q4Date).toISOString() };
    default:
      console.warn(`No preset found for: ${preset}. Falling back to 30 days.`);
      return { from: subDays(now, 30).toISOString(), to: now.toISOString() };
  }
};