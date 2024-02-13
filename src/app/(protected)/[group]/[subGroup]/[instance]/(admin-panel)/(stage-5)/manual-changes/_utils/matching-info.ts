import {
  ProjectInfo,
  StudentRow,
} from "@/lib/validations/allocation-adjustment";

import { getAsProjects } from "./get-project";

/* eslint-disable @typescript-eslint/no-unused-vars */
function getUpdatedProfile(profile: number[], prevIdx: number, newIdx: number) {
  if (prevIdx === newIdx) return profile;

  return profile.map((num, i) => {
    if (i === prevIdx) return profile[prevIdx] - 1;
    if (i === newIdx) return profile[newIdx] + 1;
    else return num;
  });
}

export function getUpdatedWeight(profile: number[]) {
  return profile.reduce((acc, val, i) => {
    return acc + val * (i + 1);
  }, 0);
}

export function handleProfileChange(
  profile: number[],
  prevIdx: number,
  newIdx: number,
  setProfile: (profile: number[]) => void,
  setWeight: (weight: number) => void,
) {
  if (prevIdx === newIdx) return;

  const updatedProfile = getUpdatedProfile(profile, prevIdx, newIdx);
  const updatedWeight = getUpdatedWeight(updatedProfile);

  setWeight(updatedWeight);
  setProfile(updatedProfile);
}

function getStudentProjects(allProjects: ProjectInfo[], row: StudentRow) {
  return getAsProjects(allProjects, row.projects);
}

function getProjectAllocations(projects: ProjectInfo[]) {
  return projects.map((e) => e.allocatedTo);
}

function getStudentAllocationIndex(alloc: string[][], studentId: string) {
  return alloc.findIndex((a) => a.includes(studentId));
}

export function getPreferenceRank(allProjects: ProjectInfo[], row: StudentRow) {
  const studentProjects = getStudentProjects(allProjects, row);
  const allocations = getProjectAllocations(studentProjects);
  return getStudentAllocationIndex(allocations, row.student.id);
}
