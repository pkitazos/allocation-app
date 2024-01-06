import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

// export const Stage = {
//   SETUP: "SETUP",
//   PROJECT_SUBMISSION: "PROJECT_SUBMISSION",
//   PROJECT_SELECTION: "PROJECT_SELECTION",
//   PROJECT_ALLOCATION: "PROJECT_ALLOCATION",
//   ALLOCATION_PUBLICATION: "ALLOCATION_PUBLICATION",
// } as const;

// export const Role = {
//   GROUP_ADMIN: "GROUP_ADMIN",
//   SUB_GROUP_ADMIN: "SUB_GROUP_ADMIN",
//   SUPERVISOR: "SUPERVISOR",
//   STUDENT: "STUDENT",
//   UNREGISTERED: "UNREGISTERED",
// } as const;
