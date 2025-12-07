import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashStringToColors(str: string) {
  // simple deterministic hash -> two H values for gradient
  let h1 = 0;
  for (let i = 0; i < str.length; i++) h1 = (h1 << 5) - h1 + str.charCodeAt(i);
  const hue1 = Math.abs(h1) % 360;
  const hue2 = (hue1 + 60 + (Math.abs(h1) % 120)) % 360;
  return [`hsl(${hue1} 70% 45%)`, `hsl(${hue2} 65% 55%)`];
}
