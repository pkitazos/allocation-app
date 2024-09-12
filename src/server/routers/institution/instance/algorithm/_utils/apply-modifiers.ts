import { Algorithm } from "@/lib/validations/algorithm";
import { MatchingDataDto } from "@/lib/validations/matching";

export function applyModifiers(
  { students, supervisors, projects }: MatchingDataDto,
  algorithm: Algorithm,
) {
  return {
    projects,

    students: students.map(({ preferences, ...rest }) => ({
      ...rest,
      preferences: preferences.slice(
        0,
        algorithm.maxRank === -1 ? preferences.length : algorithm.maxRank,
      ),
    })),

    supervisors: supervisors.map(({ target, upperBound, ...rest }) => {
      const newTarget = target + algorithm.targetModifier;
      const newUpperBound = upperBound + algorithm.upperBoundModifier;
      return {
        ...rest,
        target: newTarget,
        upperBound: Math.max(newTarget, newUpperBound),
      };
    }),
  };
}
