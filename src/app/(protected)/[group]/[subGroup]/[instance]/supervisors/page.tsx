import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";
import { SupervisorsDataTable } from "./supervisors-data-table";

export default async function Page({ params }: { params: instanceParams }) {
  const session = await auth();

  if (
    session &&
    session.user.role !== "SUPER_ADMIN" &&
    session.user.role !== "GROUP_ADMIN" &&
    session.user.role !== "SUB_GROUP_ADMIN" &&
    session.user.role !== "SUPERVISOR"
  ) {
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
      <SupervisorsDataTable data={tableData} />
    </div>
  );
}
