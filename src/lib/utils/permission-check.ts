import { adminLevelOrd } from "@/lib/db";
import { AdminLevel } from "@prisma/client";

export function permissionCheck(level: AdminLevel, minimumLevel: AdminLevel) {
  return adminLevelOrd[level] >= adminLevelOrd[minimumLevel];
}
