import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomChoice = <T extends unknown>(arr: T[]): T => {
  return Array.from(arr).sort(() => 0.5 - Math.random())[0];
};

export const checkUpload = <T extends unknown>(
  label: string,
  data: T[],
  expectedRows: number,
) => {
  if (data.length !== expectedRows) console.log("ERROR", label, data.length);
  else console.log("SUCCESS", label, data.length);
  return data.length === expectedRows;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
