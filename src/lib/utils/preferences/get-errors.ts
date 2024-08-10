import { ProjectPreference } from "@/lib/validations/board";
import { computeOverSelected } from "./over-selected";

export function getSubmissionErrors(
  preferences: ProjectPreference[],
  restrictions: {
    minPreferences: number;
    maxPreferences: number;
    maxPreferencesPerSupervisor: number;
  },
) {
  const overSelected = computeOverSelected(
    preferences,
    restrictions.maxPreferencesPerSupervisor,
  );

  return {
    isOver: preferences.length > restrictions.maxPreferences,
    isUnder: preferences.length < restrictions.minPreferences,
    hasOverSelectedSupervisor: overSelected.length > 0,
    overSelected,
  };
}
