/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AdminInSpace,
  AdminLevel,
  AllocationGroup,
  AllocationInstance,
  AllocationSubGroup,
  Flag,
  FlagOnProject,
  Invitation,
  Preference,
  PreferenceType,
  Project,
  Role,
  Stage,
  SupervisorInstanceDetails,
  Tag,
  TagOnProject,
  UserInInstance,
} from "@prisma/client";
import { User } from "next-auth";

import {
  GenerousAlgorithm,
  GreedyAlgorithm,
  GreedyGenAlgorithm,
  MinCostAlgorithm,
} from "@/lib/algorithms";
import { slugify } from "@/lib/utils/general/slugify";

import { preferenceData } from "./preferences";
import { projectData } from "./projects";

type New<T> = Omit<T, "id" | "systemId">;

export const superAdmin: User = {
  id: "super-admin",
  name: "Super-Admin",
  email: "super.allocationapp@gmail.com",
};

export const superAdminInSpace: New<AdminInSpace> = {
  userId: superAdmin.id,
  allocationGroupId: null,
  allocationSubGroupId: null,
  adminLevel: AdminLevel.SUPER,
};

const evaluator__subGroupAdmin = (idx: number): User => ({
  id: `${idx}-012345w`,
  name: "Michael Walker",
  email: `${idx}-012345w@email.com`,
});

const dummy__supervisors = (idx: number): User[] => [
  {
    id: `${idx}-123456s`,
    name: "Daniel Schmidt",
    email: `${idx}-123456s@email.com`,
  },
  {
    id: `${idx}-123457j`,
    name: "Sarah Jones",
    email: `${idx}-123457j@email.com`,
  },
  {
    id: `${idx}-123458t`,
    name: "Kai Tanaka",
    email: `${idx}-123458t@email.com`,
  },
  {
    id: `${idx}-123459l`,
    name: "Maria Lopez",
    email: `${idx}-123459l@email.com`,
  },
];

const evaluator__supervisor = (idx: number): User => ({
  id: `${idx}-123460d`,
  name: "Isabelle Dubois",
  email: `${idx}-123460d@email.com`,
});

const allSupervisors = (idx: number): User[] => [
  ...dummy__supervisors(idx),
  evaluator__supervisor(idx),
];

const dummy__students = (idx: number): User[] => [
  {
    id: `${idx}-234567k`,
    name: "Aaliyah Khan",
    email: `${idx}-234567k@email.com`,
  },
  {
    id: `${idx}-234568g`,
    name: "Diego Garcia",
    email: `${idx}-234568g@email.com`,
  },
  { id: `${idx}-234569c`, name: "Mei Chen", email: `${idx}-234569c@email.com` },
  {
    id: `${idx}-234570p`,
    name: "Anya Petrova",
    email: `${idx}-234570p@email.com`,
  },
  {
    id: `${idx}-234571d`,
    name: "Aisha Diallo",
    email: `${idx}-234571d@email.com`,
  },
  {
    id: `${idx}-234572c`,
    name: "Ethan Cohen",
    email: `${idx}-234572c@email.com`,
  },
  {
    id: `${idx}-234573b`,
    name: "Nadira Benali",
    email: `${idx}-234573b@email.com`,
  },
  {
    id: `${idx}-234574o`,
    name: "Liam O'Sullivan",
    email: `${idx}-234574o@email.com`,
  },
  {
    id: `${idx}-234575y`,
    name: "Hana Yoshida",
    email: `${idx}-234575y@email.com`,
  },
  {
    id: `${idx}-234576n`,
    name: "David Nguyen",
    email: `${idx}-234576n@email.com`,
  },
  {
    id: `${idx}-234577r`,
    name: "Elena Rodriguez",
    email: `${idx}-234577r@email.com`,
  },
  {
    id: `${idx}-234578a`,
    name: "Kofi Asante",
    email: `${idx}-234578a@email.com`,
  },
  {
    id: `${idx}-234579k`,
    name: "Olivia Kapoor",
    email: `${idx}-234579k@email.com`,
  },
  {
    id: `${idx}-234580h`,
    name: "Mateo Hernandez",
    email: `${idx}-234580h@email.com`,
  },
];

const evaluator__student = (idx: number): User => ({
  id: `${idx}-234581p`,
  name: "Chloe Park",
  email: `${idx}-234581p@email.com`,
});

const allStudents = (idx: number): User[] => [
  ...dummy__students(idx),
  evaluator__student(idx),
];

export const allUsers = (idx: number): User[] => [
  evaluator__subGroupAdmin(idx),
  ...allSupervisors(idx),
  ...allStudents(idx),
];

const supervisorCapacities = (
  idx: number,
): (Pick<
  SupervisorInstanceDetails,
  | "projectAllocationLowerBound"
  | "projectAllocationTarget"
  | "projectAllocationUpperBound"
> & { userId: string })[] => [
  {
    userId: allSupervisors(idx)[0].id,
    projectAllocationLowerBound: 0,
    projectAllocationTarget: 1,
    projectAllocationUpperBound: 3,
  },
  {
    userId: allSupervisors(idx)[1].id,
    projectAllocationLowerBound: 0,
    projectAllocationTarget: 2,
    projectAllocationUpperBound: 3,
  },
  {
    userId: allSupervisors(idx)[2].id,
    projectAllocationLowerBound: 0,
    projectAllocationTarget: 2,
    projectAllocationUpperBound: 3,
  },
  {
    userId: allSupervisors(idx)[3].id,
    projectAllocationLowerBound: 0,
    projectAllocationTarget: 2,
    projectAllocationUpperBound: 3,
  },
  {
    userId: allSupervisors(idx)[4].id,
    projectAllocationLowerBound: 0,
    projectAllocationTarget: 2,
    projectAllocationUpperBound: 3,
  },
];

const allocationInstance = {
  id: "2024-2025",
  displayName: "2024-2025",
};

const allocationSubGroup = {
  id: "lvl-4",
  displayName: "Level 4 Individual Project",
};

const allocationGroup = (idx: number) => ({
  id: `socs-${idx.toString().padStart(3, "0")}`,
  displayName: `School of Computing Science ${idx.toString().padStart(3, "0")}`,
});

const instanceId = (idx: number) => ({
  allocationGroupId: allocationGroup(idx).id,
  allocationInstanceId: allocationInstance.id,
  allocationSubGroupId: allocationSubGroup.id,
});

const inInstance = <T>(idx: number, data: T) => ({
  ...instanceId(idx),
  ...data,
});

const flagData: Pick<Flag, "title">[] = [
  { title: "BSc Computing Science" },
  { title: "BSc Software Engineering" },
  { title: "MSci Computing Science" },
  { title: "MSci Software Engineering" },
  { title: "CS Joint Honours" },
];

const tagData: Pick<Tag, "title">[] = [
  { title: "Python" },
  { title: "Java" },
  { title: "C++" },
  { title: "JavaScript" },
  { title: "Ruby" },
  { title: "PHP" },
  { title: "HTML/CSS" },
  { title: "Artificial Intelligence" },
  { title: "Machine Learning" },
  { title: "Data Science" },
  { title: "Web Development" },
  { title: "Mobile App Development" },
  { title: "Cybersecurity" },
  { title: "Databases" },
  { title: "Cloud Computing" },
  { title: "DevOps" },
  { title: "Natural Language Processing" },
  { title: "Computer Vision" },
  { title: "Game Development" },
];

// dependant

export const invites = (idx: number): Invitation[] => [
  inInstance(idx, { email: evaluator__subGroupAdmin(idx).email! }),
  ...dummy__supervisors(idx).map((s) => inInstance(idx, { email: s.email! })),
  ...dummy__students(idx).map((s) => inInstance(idx, { email: s.email! })),
];

export const sampleGroup = (idx: number): AllocationGroup => ({
  id: allocationGroup(idx).id,
  displayName: allocationGroup(idx).displayName,
});

export const sampleSubGroup = (idx: number): AllocationSubGroup => ({
  id: allocationSubGroup.id,
  allocationGroupId: allocationGroup(idx).id,
  displayName: allocationSubGroup.displayName,
});

export const sampleInstance = (idx: number): AllocationInstance => ({
  id: allocationInstance.id,
  allocationGroupId: allocationGroup(idx).id,
  allocationSubGroupId: allocationSubGroup.id,
  displayName: allocationInstance.displayName,
  stage: Stage.SETUP,
  supervisorsCanAccess: false,
  projectSubmissionDeadline: new Date(2024, 2, 20),
  studentsCanAccess: false,
  preferenceSubmissionDeadline: new Date(2024, 3, 20),
  minPreferences: 6,
  maxPreferences: 6,
  maxPreferencesPerSupervisor: 2,
  selectedAlgName: null,
});

export const adminsInSpaces = (idx: number): New<AdminInSpace>[] => [
  {
    userId: evaluator__subGroupAdmin(idx).id,
    allocationGroupId: allocationGroup(idx).id,
    allocationSubGroupId: allocationSubGroup.id,
    adminLevel: AdminLevel.SUB_GROUP,
  },
];

const supervisors__userInInstance = (idx: number): UserInInstance[] =>
  allSupervisors(idx).map(({ id }) =>
    inInstance(idx, {
      userId: id,
      role: Role.SUPERVISOR,
      joined: true,
      submittedPreferences: false,
    }),
  );

const students__userInInstance = (idx: number): UserInInstance[] =>
  dummy__students(idx).map(({ id }) =>
    inInstance(idx, {
      userId: id,
      role: Role.STUDENT,
      joined: true,
      submittedPreferences: true,
    }),
  );

const evaluator__student__userInInstance = (idx: number): UserInInstance =>
  inInstance(idx, {
    userId: evaluator__student(idx).id,
    role: Role.STUDENT,
    joined: true,
    submittedPreferences: false,
  });

export const allUsersInInstance = (idx: number): UserInInstance[] => [
  ...supervisors__userInInstance(idx),
  ...students__userInInstance(idx),
  evaluator__student__userInInstance(idx),
];

export const capacities = (idx: number): SupervisorInstanceDetails[] =>
  supervisorCapacities(idx).map((s) => inInstance(idx, s));

export const projects = (idx: number): Project[] =>
  projectData(idx).map((p) =>
    inInstance(idx, {
      id: p.id,
      title: p.title,
      description: p.description,
      supervisorId: allSupervisors(idx)[p.supervisorId].id,
      preAllocatedStudentId: null,
      capacityLowerBound: 0,
      capacityUpperBound: 1,
    }),
  );

export const preferences = (idx: number): Preference[] =>
  preferenceData(idx).map((p) =>
    inInstance(idx, {
      projectId: p.projectId,
      userId: allStudents(idx)[p.studentIdx].id,
      rank: p.studentRanking,
      type: PreferenceType.PREFERENCE,
    }),
  );

export const flags = (idx: number): Flag[] =>
  flagData.map(({ title }) =>
    inInstance(idx, { id: slugify(idx + title), title }),
  );

export const flagsOnProjects = (idx: number): FlagOnProject[] =>
  projectData(idx).flatMap((p) =>
    p.flags.map((f) => ({
      projectId: p.id,
      flagId: slugify(idx + f.title),
    })),
  );

export const tags = (idx: number): Tag[] =>
  tagData.map(({ title }) =>
    inInstance(idx, { id: slugify(idx + title), title }),
  );

export const tagsOnProjects = (idx: number): TagOnProject[] =>
  projectData(idx).flatMap((p) =>
    p.tags.map((t) => ({
      projectId: p.id,
      tagId: slugify(idx + t.title),
    })),
  );

const builtInAlgorithms = [
  GenerousAlgorithm,
  GreedyAlgorithm,
  MinCostAlgorithm,
  GreedyGenAlgorithm,
];

export const algorithms = (idx: number) =>
  builtInAlgorithms.map((alg) =>
    inInstance(idx, {
      ...alg, // TODO: confirm descriptions
      matchingResultData: JSON.stringify({}),
    }),
  );
