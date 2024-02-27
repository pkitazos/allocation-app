import { Role } from "@prisma/client";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import AdminPanel from "./(admin-panel)/admin-panel";
import { StudentOverview } from "./(student)/student-overview";
import { SupervisorOverview } from "./(supervisor)/supervisor-overview";

export default async function Page({ params }: { params: InstanceParams }) {
  const role = await api.user.role({ params });

  if (role === Role.STUDENT) return <StudentOverview params={params} />;
  if (role === Role.SUPERVISOR) return <SupervisorOverview params={params} />;

  return <AdminPanel params={params} />;
}
