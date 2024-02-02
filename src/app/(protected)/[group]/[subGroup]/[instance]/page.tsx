import { api } from "@/lib/trpc/server";
import { Role } from "@prisma/client";
import AdminPanel from "./(admin-panel)/admin-panel";
import { StudentOverview } from "./(student)/student-overview";
import { SupervisorOverview } from "./(supervisor)/supervisor-overview";
import { instanceParams } from "@/lib/validations/params";

export default async function Page({ params }: { params: instanceParams }) {
  const role = await api.user.role.query({ params });

  if (role === Role.STUDENT) return <StudentOverview params={params} />;
  if (role === Role.SUPERVISOR) return <SupervisorOverview params={params} />;

  return <AdminPanel params={params} />;
}
