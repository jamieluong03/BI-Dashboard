import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatOrderId(uuid: string) {
  const shortId = uuid.split('-')[0].toUpperCase().slice(0, 4);
  return `INV-${shortId}`;
}