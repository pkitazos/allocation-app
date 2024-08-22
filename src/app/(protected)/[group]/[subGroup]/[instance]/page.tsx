import { Role } from "@prisma/client";

import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import AdminPanel from "./(admin-panel)/admin-panel";
import { StudentOverview } from "./(student)/student-overview";
import { SupervisorOverview } from "./(supervisor)/supervisor-overview";

export default async function Page({ params }: { params: InstanceParams }) {
  const isAdmin = await api.ac.adminInInstance({ params: params });
  if (isAdmin) return <AdminPanel params={params} />;

  const role = await api.user.role({ params });
  if (role === Role.STUDENT) return <StudentOverview params={params} />;
  if (role === Role.SUPERVISOR) return <SupervisorOverview params={params} />;

  // could potentially throw error as this should be caught by the layout
  return <Unauthorised message="You don't have permission to view this page" />;
}
