import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { startOfDay, endOfDay, subDays, subMonths, subYears, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, setMonth, startOfYear, isWithinInterval } from "date-fns";

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

export const getMockRefunds = (revenue: number, date: Date, channel?: string) => {
  if (revenue <= 0) return 0;

  // Channel Base Rate (Intent-based)
  let baseRate = 0.06; // Standard 6%

  const channelLower = channel?.toLowerCase() || "";
  if (channelLower.includes("meta") || channelLower.includes("instagram")) {
    baseRate = 0.13; 
  } else if (channelLower.includes("google") || channelLower.includes("search")) {
    baseRate = 0.05;
  } else if (channelLower.includes("direct") || channelLower.includes("email")) {
    baseRate = 0.03;
  }

  // Return Window Multiplier: 2-3 week window AFTER your sales peaks
  let returnMultiplier = 1.0;

  const year = date.getFullYear();
  
  const isWindow = (startMonth: number, startDay: number, endMonth: number, endDay: number) => 
    isWithinInterval(date, {
      start: new Date(year, startMonth, startDay),
      end: new Date(year, endMonth, endDay),
    });

  if (isWindow(0, 1, 0, 31)) {
    // Post-Christmas/Year-End
    returnMultiplier = 2.4; 
  } else if (isWindow(1, 20, 2, 10)) {
    // Post-Valentine's
    returnMultiplier = 1.8;
  } else if (isWindow(4, 15, 5, 5)) {
    // Post-Mother's Day
    returnMultiplier = 1.5;
  }
  // Add a jitter of +/- 2.5% so the data doesn't look like a flat math formula
  const jitter = (Math.random() * 0.05) - 0.025;
  
  const finalRate = (baseRate * returnMultiplier) + jitter;

  const clampedRate = Math.min(Math.max(finalRate, 0.02), 0.45);

  return parseFloat((revenue * clampedRate).toFixed(2));
};

export type RawEntry = { name: string; value: number; isTotal?: boolean; color: string };

export function computeWaterfallData(raw: RawEntry[]) {
  let runningTotal = 0;

  return raw.map(entry => {
    const { value, isTotal = false } = entry;
    let barBottom: number, barTop: number;

    if (isTotal) {
      barBottom = 0;
      barTop = value;
    } else if (value >= 0) {
      // For Revenue (Positive)
      barBottom = runningTotal;
      barTop = runningTotal + value;
    } else {
      // For Expenses (Negative)
      barBottom = runningTotal + value;
      barTop = runningTotal; 
    }

    if (!isTotal) {
      runningTotal += value;
    }

    return {
      ...entry,
      waterfallRange: [barBottom, barTop],
    };
  });
};