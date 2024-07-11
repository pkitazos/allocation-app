export function computeProjectSubmissionTarget(
  supervisorTargetCount: number,
  supervisorAllocatedProjectCount: number,
) {
  const submissionTarget =
    2 * (supervisorTargetCount - supervisorAllocatedProjectCount);

  return submissionTarget;
}
