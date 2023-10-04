import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomChoice = <T extends unknown>(arr: T[]): T => {
  return Array.from(arr).sort(() => 0.5 - Math.random())[0];
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
