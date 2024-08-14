import { ProjectPreference } from "@/lib/validations/board";

export function computeOverSelected(
  preferenceList: ProjectPreference[],
  maxPerSupervisor: number,
) {
  const supervisorCounts = preferenceList.reduce(
    (acc, { supervisorId }) =>
      acc.set(supervisorId, (acc.get(supervisorId) || 0) + 1),
    new Map<string, number>(),
  );

  const supervisorNames = preferenceList.reduce(
    (acc, { supervisorId, supervisorName }) => ({
      ...acc,
      [supervisorId]: supervisorName,
    }),
    {} as { [key: string]: string },
  );

  const overSelected = Array.from(supervisorCounts.entries())
    .map(([s, n]) => ({
      id: s,
      name: supervisorNames[s],
      count: n,
    }))
    .filter(({ count }) => count > maxPerSupervisor);

  return overSelected;
}
