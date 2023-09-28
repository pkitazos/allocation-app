import { currentUser } from "@clerk/nextjs";

export const userTier = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SUPERVISOR: "SUPERVISOR",
  STUDENT: "STUDENT",
} as const;

export const checkAuth = async () => {
  const user = await currentUser();
  if (!user) return;

  const isSuperAdmin = user.publicMetadata.isSuperAdmin as boolean;
  if (isSuperAdmin) return 3;

  const isAdmin = user.publicMetadata.isAdmin as boolean;
  if (isAdmin) return 2;

  const isStudent = user.publicMetadata.isStudent as boolean;
  if (isStudent) return 0;

  return 1;
};
