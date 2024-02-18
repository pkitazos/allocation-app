import { Role } from "@prisma/client";

import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { SupervisorsDataTable } from "./_components/supervisors-data-table";

export default async function Page({ params }: { params: InstanceParams }) {
  const { user, role } = await api.user.userRole.query({ params });

  if (role !== Role.ADMIN && role !== Role.SUPERVISOR) {
    return <Unauthorised message="You don't have access to this page" />;
  }

  const tableData = await api.institution.instance.supervisors.query({
    params,
  });

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">Supervisors</h1>
      </div>
      <SupervisorsDataTable data={tableData} user={user} role={role} />
    </div>
  );
}
