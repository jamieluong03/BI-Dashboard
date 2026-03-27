import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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