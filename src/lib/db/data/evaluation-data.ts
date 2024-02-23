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

const evaluator__subGroupAdmin: User = {
  id: "012345w",
  name: "Michael Walker",
  email: "012345w@email.com",
};

const dummy__supervisors: User[] = [
  { id: "123456s", name: "Daniel Schmidt", email: "123456s@email.com" },
  { id: "123457j", name: "Sarah Jones", email: "123457j@email.com" },
  { id: "123458t", name: "Kai Tanaka", email: "123458t@email.com" },
  { id: "123459l", name: "Maria Lopez", email: "123459l@email.com" },
];

const evaluator__supervisor: User = {
  id: "123460d",
  name: "Isabelle Dubois",
  email: "123460d@email.com",
};

const allSupervisors: User[] = [...dummy__supervisors, evaluator__supervisor];

const dummy__students: User[] = [
  { id: "234567k", name: "Aaliyah Khan", email: "234567k@email.com" },
  { id: "234568g", name: "Diego Garcia", email: "234568g@email.com" },
  { id: "234569c", name: "Mei Chen", email: "234569c@email.com" },
  { id: "234570p", name: "Anya Petrova", email: "234570p@email.com" },
  { id: "234571d", name: "Aisha Diallo", email: "234571d@email.com" },
  { id: "234572c", name: "Ethan Cohen", email: "234572c@email.com" },
  { id: "234573b", name: "Nadira Benali", email: "234573b@email.com" },
  { id: "234574o", name: "Liam O'Sullivan", email: "234574o@email.com" },
  { id: "234575y", name: "Hana Yoshida", email: "234575y@email.com" },
  { id: "234576n", name: "David Nguyen", email: "234576n@email.com" },
  { id: "234577r", name: "Elena Rodriguez", email: "234577r@email.com" },
  { id: "234578a", name: "Kofi Asante", email: "234578a@email.com" },
  { id: "234579k", name: "Olivia Kapoor", email: "234579k@email.com" },
  { id: "234580h", name: "Mateo Hernandez", email: "234580h@email.com" },
];

// // const studentFlags = [
// //   { studentIdx: 0, flagTitle: "BSc Computing Science" },
// //   { studentIdx: 1, flagTitle: "BSc Software Engineering" },
// //   { studentIdx: 2, flagTitle: "MSci Computing Science" },
// //   { studentIdx: 3, flagTitle: "MSci Software Engineering" },
// //   { studentIdx: 4, flagTitle: "CS Joint Honours" },
// //   { studentIdx: 5, flagTitle: "BSc Computing Science" },
// //   { studentIdx: 6, flagTitle: "BSc Software Engineering" },
// //   { studentIdx: 7, flagTitle: "MSci Computing Science" },
// //   { studentIdx: 8, flagTitle: "MSci Software Engineering" },
// //   { studentIdx: 9, flagTitle: "CS Joint Honours" },
// //   { studentIdx: 10, flagTitle: "BSc Computing Science" },
// //   { studentIdx: 11, flagTitle: "BSc Software Engineering" },
// //   { studentIdx: 12, flagTitle: "MSci Computing Science" },
// //   { studentIdx: 13, flagTitle: "MSci Software Engineering" },
// //   { studentIdx: 14, flagTitle: "CS Joint Honours" },
// // ];

const evaluator__student: User = {
  id: "234581p",
  name: "Chloe Park",
  email: "234581p@email.com",
};

const allStudents: User[] = [...dummy__students, evaluator__student];

export const allUsers: User[] = [
  superAdmin,
  evaluator__subGroupAdmin,
  ...allSupervisors,
  ...allStudents,
];

const supervisorCapacities: (Pick<
  SupervisorInstanceDetails,
  | "projectAllocationLowerBound"
  | "projectAllocationTarget"
  | "projectAllocationUpperBound"
> & { userId: string })[] = [
  {
    userId: allSupervisors[0].id,
    projectAllocationLowerBound: 0,
    projectAllocationTarget: 1,
    projectAllocationUpperBound: 3,
  },
  {
    userId: allSupervisors[1].id,
    projectAllocationLowerBound: 0,
    projectAllocationTarget: 2,
    projectAllocationUpperBound: 3,
  },
  {
    userId: allSupervisors[2].id,
    projectAllocationLowerBound: 0,
    projectAllocationTarget: 2,
    projectAllocationUpperBound: 3,
  },
  {
    userId: allSupervisors[3].id,
    projectAllocationLowerBound: 0,
    projectAllocationTarget: 2,
    projectAllocationUpperBound: 3,
  },
  {
    userId: allSupervisors[4].id,
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

const allocationGroup = {
  id: "socs",
  displayName: "School of Computing Science",
};

const instanceId = {
  allocationGroupId: allocationGroup.id,
  allocationInstanceId: allocationInstance.id,
  allocationSubGroupId: allocationSubGroup.id,
};

const inInstance = <T>(data: T) => ({ ...instanceId, ...data });

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

export const invites: Invitation[] = [
  { ...instanceId, email: evaluator__subGroupAdmin.email! },
  ...dummy__supervisors.map((s) => inInstance({ email: s.email! })),
  ...dummy__students.map((s) => inInstance({ email: s.email! })),
];

export const sampleGroup: AllocationGroup = {
  id: allocationGroup.id,
  displayName: allocationGroup.displayName,
};

export const sampleSubGroup: AllocationSubGroup = {
  id: allocationSubGroup.id,
  allocationGroupId: allocationGroup.id,
  displayName: allocationSubGroup.displayName,
};

export const sampleInstance: AllocationInstance = {
  id: allocationInstance.id,
  allocationGroupId: allocationGroup.id,
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
};

export const adminsInSpaces: New<AdminInSpace>[] = [
  {
    userId: superAdmin.id,
    allocationGroupId: null,
    allocationSubGroupId: null,
    adminLevel: AdminLevel.SUPER,
  },
  {
    userId: evaluator__subGroupAdmin.id,
    allocationGroupId: allocationGroup.id,
    allocationSubGroupId: allocationSubGroup.id,
    adminLevel: AdminLevel.SUB_GROUP,
  },
];

const supervisors__userInInstance: UserInInstance[] = allSupervisors.map(
  ({ id }) =>
    inInstance({
      userId: id,
      role: Role.SUPERVISOR,
      joined: true,
      submittedPreferences: false,
    }),
);

const students__userInInstance: UserInInstance[] = dummy__students.map(
  ({ id }) =>
    inInstance({
      userId: id,
      role: Role.STUDENT,
      joined: true,
      submittedPreferences: true,
    }),
);

const evaluator__student__userInInstance: UserInInstance = inInstance({
  userId: evaluator__student.id,
  role: Role.STUDENT,
  joined: true,
  submittedPreferences: false,
});

export const allUsersInInstance: UserInInstance[] = [
  ...supervisors__userInInstance,
  ...students__userInInstance,
  evaluator__student__userInInstance,
];

export const supervisorDetails: SupervisorInstanceDetails[] =
  supervisorCapacities.map((s) => inInstance(s));

export const projects: Project[] = projectData.map((p) =>
  inInstance({
    id: p.id,
    title: p.title,
    description: p.description,
    supervisorId: allSupervisors[p.supervisorId].id,
    preAllocatedStudentId: null,
    capacityLowerBound: 0,
    capacityUpperBound: 1,
  }),
);

export const preferences: Preference[] = preferenceData.map((p) =>
  inInstance({
    projectId: p.projectId,
    userId: allStudents[p.studentIdx].id,
    rank: p.studentRanking,
    type: PreferenceType.PREFERENCE,
  }),
);

// // const projectAllocation: ProjectAllocation[] = [];

export const flags: Flag[] = flagData.map(({ title }) =>
  inInstance({ id: slugify(title), title }),
);

export const flagsOnProjects: FlagOnProject[] = projectData.flatMap((p) =>
  p.flags.map((f) => ({ projectId: p.id, flagId: slugify(f.title) })),
);

// // export const flagsOnStudents: FlagOnStudent[] = studentFlags.map((e) =>
// //   inInstance({
// //     userId: allStudents[e.studentIdx].id,
// //     flagId: slugify(e.flagTitle),
// //   }),
// // );

export const tags: Tag[] = tagData.map(({ title }) =>
  inInstance({ id: slugify(title), title }),
);

export const tagsOnProjects: TagOnProject[] = projectData.flatMap((p) =>
  p.tags.map((t) => ({ projectId: p.id, tagId: slugify(t.title) })),
);

const builtInAlgorithms = [
  GenerousAlgorithm,
  GreedyAlgorithm,
  MinCostAlgorithm,
  GreedyGenAlgorithm,
];

export const algorithms = builtInAlgorithms.map((alg) =>
  inInstance({
    ...alg, // TODO: confirm descriptions
    matchingResultData: JSON.stringify({}),
  }),
);
