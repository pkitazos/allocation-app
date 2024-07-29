import { flagToLevel } from "@/content/configs/flag-to-level";

export function getStudentLevelFromFlag<T extends { title: string }>(item: T) {
  const keys = Object.keys(flagToLevel) as (keyof typeof flagToLevel)[];
  for (const key of keys) {
    if (item.title.startsWith(flagToLevel[key].label)) {
      return flagToLevel[key].level;
    }
  }
  return -1;
}

export function getFlagLabelFromStudentLevel(level: number) {
  const [flagLabel] = Object.entries(flagToLevel).map(([_, value]) =>
    value.level === level ? value.label : null,
  );

  if (!flagLabel) throw new Error(`Invalid student level: ${level}`);

  return flagLabel;
}
