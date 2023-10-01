import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Stage = {
  SETUP: "SETUP",
  PROJECT_SUBMISSION: "PROJECT_SUBMISSION",
  PROJECT_SELECTION: "PROJECT_SELECTION",
  PROJECT_ALLOCATION: "PROJECT_ALLOCATION",
  ALLOCATION_PUBLICATION: "ALLOCATION_PUBLICATION",
} as const;
export type Stage = (typeof Stage)[keyof typeof Stage];
export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
};
export type Allocation = {
  projectId: string;
  studentId: string;
};
export type AllocationGroup = {
  id: string;
  name: string;
  groupAdminId: string;
};
export type AllocationInstance = {
  id: string;
  allocationSubGroupId: string;
  name: string;
  stage: Stage;
};
export type AllocationInstanceToStudent = {
  A: string;
  B: string;
};
export type AllocationInstanceToSupervisor = {
  A: string;
  B: string;
};
export type AllocationSubGroup = {
  id: string;
  name: string;
  allocationGroupId: string;
};
export type Flag = {
  id: string;
  title: string;
};
export type FlagToProject = {
  A: string;
  B: string;
};
export type FlagToStudent = {
  A: string;
  B: string;
};
export type GroupAdmin = {
  id: string;
  name: string;
  allocationGroupId: string | null;
};
export type Preference = {
  projectId: string;
  studentId: string;
  rank: number;
};
export type Project = {
  id: string;
  title: string;
  description: string;
  supervisorId: string;
  allocationInstanceId: string;
};
export type ProjectToTag = {
  A: string;
  B: string;
};
export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Timestamp;
};
export type Shortlist = {
  projectId: string;
  studentId: string;
};
export type Student = {
  id: string;
  name: string;
  studentId: string;
};
export type SubGroupAdmin = {
  id: string;
  name: string;
  allocationSubGroupId: string;
};
export type Supervisor = {
  id: string;
  name: string;
};
export type Tag = {
  id: string;
  title: string;
};
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Timestamp | null;
  image: string | null;
};
export type VerificationToken = {
  identifier: string;
  token: string;
  expires: Timestamp;
};
export type DB = {
  _AllocationInstanceToStudent: AllocationInstanceToStudent;
  _AllocationInstanceToSupervisor: AllocationInstanceToSupervisor;
  _FlagToProject: FlagToProject;
  _FlagToStudent: FlagToStudent;
  _ProjectToTag: ProjectToTag;
  Account: Account;
  Allocation: Allocation;
  AllocationGroup: AllocationGroup;
  AllocationInstance: AllocationInstance;
  AllocationSubGroup: AllocationSubGroup;
  Flag: Flag;
  GroupAdmin: GroupAdmin;
  Preference: Preference;
  Project: Project;
  Session: Session;
  Shortlist: Shortlist;
  Student: Student;
  SubGroupAdmin: SubGroupAdmin;
  Supervisor: Supervisor;
  Tag: Tag;
  User: User;
  VerificationToken: VerificationToken;
};
