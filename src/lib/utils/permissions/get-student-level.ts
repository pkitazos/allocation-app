import { flagToLevel } from "@/content/configs/flag-to-level";

export function getStudentLevelFromFlag<T extends { title: string }>(
  item: T,
): number {
  const keys = Object.keys(flagToLevel) as (keyof typeof flagToLevel)[];
  for (const key of keys) {
    if (item.title.startsWith(flagToLevel[key].label)) {
      return flagToLevel[key].level;
    }
  }
  return -1;
}
