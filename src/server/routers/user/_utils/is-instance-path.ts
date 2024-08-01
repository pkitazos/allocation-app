/**
 * if user is in /admin, /[group] or /[group]/[subGroup] then they can click on everything
 * if user is in /[group]/[subGroup]/[instance] then they can't click on [group] or [subGroup]
 */
export function isInstancePath(segments: string[]) {
  if (
    segments.length < 3 ||
    (segments.length === 3 && segments[2] === "create-instance")
  ) {
    /**
     * if segments.length is less than 3 then we are in one of the following paths
     * /
     * /admin
     * /admin/create-group
     * /[group]
     * /[group]/create-sub-group
     * /[group]/[subGroup]
     *
     */
    return false;
  } else {
    /**
     * otherwise segments.length is greater than or equal to 3
     * if it's equal to 3 then it's /[group]/[subGroup]/[instance]
     * if it's greater than 3 then it's /[group]/[subGroup]/[instance]/[...something]
     * in which case we know that we are in an instance
     */
    return true;
  }
}
