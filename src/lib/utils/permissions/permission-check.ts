import { AdminLevel } from "@prisma/client";

import { adminLevelOrd } from "@/lib/db";

export function permissionCheck(level: AdminLevel, minimumLevel: AdminLevel) {
  return adminLevelOrd[level] >= adminLevelOrd[minimumLevel];
}
