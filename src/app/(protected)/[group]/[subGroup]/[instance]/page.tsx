import { Role } from "@prisma/client";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";
import { isSuperAdmin } from "@/server/utils/is-super-admin";

import AdminPanel from "./(admin-panel)/admin-panel";
import { StudentOverview } from "./(student)/student-overview";
import { SupervisorOverview } from "./(supervisor)/supervisor-overview";

export default async function Page({ params }: { params: InstanceParams }) {
  const level = await api.user.adminLevelInSubGroup({ params: params, group: params.group, subGroup: params.subGroup });
  if (level === "SUB_GROUP" || level === "GROUP" || await api.user.adminLevel({ params }) == "SUPER") {
    return <AdminPanel params={params} />;
  }
  const role = await api.user.role({ params });
  if (role === Role.ADMIN) return <AdminPanel params={params} />;
  if (role === Role.STUDENT) return <StudentOverview params={params} />;
  if (role === Role.SUPERVISOR) return <SupervisorOverview params={params} />;

  return <AdminPanel params={params} />;
}
