import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { instanceParams } from "./validations/params";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomChoice = <T>(arr: T[]): T => {
  return Array.from(arr).sort(() => 0.5 - Math.random())[0];
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function slugify(label: string): string {
  return label.replaceAll("&", "and").replaceAll(" ", "-").toLowerCase();
}

export function groupBy<
  T extends Record<K, string | number | symbol>,
  K extends keyof T,
>(arr: T[], property: K): Record<T[K], T[]> {
  return arr.reduce(
    (memo, x) => {
      const key = x[property];
      if (!memo[key]) memo[key] = [];
      memo[key].push(x);
      return memo;
    },
    {} as Record<T[K], T[]>,
  );
}

export function getInstancePath(instanceParams: instanceParams) {
  const { group, subGroup, instance } = instanceParams;
  return `/${group}/${subGroup}/${instance}`;
}
