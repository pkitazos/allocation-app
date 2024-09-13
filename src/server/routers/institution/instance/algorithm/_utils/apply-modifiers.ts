import { Algorithm } from "@/lib/validations/algorithm";
import { MatchingDataDto } from "@/lib/validations/matching";

export function applyModifiers(
  { students, supervisors, projects }: MatchingDataDto,
  { maxRank, targetModifier, upperBoundModifier }: Algorithm,
) {
  return {
    projects,

    students: students.map(({ preferences, ...rest }) => ({
      ...rest,
      preferences: preferences.slice(
        0,
        maxRank === -1 ? preferences.length : maxRank,
      ),
    })),

    supervisors: supervisors.map(({ target, upperBound, ...rest }) => {
      const newTarget = target + targetModifier;
      const newUpperBound = upperBound + upperBoundModifier;
      return {
        ...rest,
        target: newTarget,
        upperBound: Math.max(newTarget, newUpperBound),
      };
    }),
  };
}
