import { Role } from "@prisma/client";

export function roleCheck(userRole: Role, permittedRoles: Role[]) {
  return permittedRoles.includes(userRole);
}
