"use client";
import { Role, Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import DataTable from "@/components/ui/data-table/data-table";

import { api } from "@/lib/trpc/client";
import { SearchableColumn } from "@/lib/validations/table";

import { supervisorColumns, SupervisorData } from "./supervisors-columns";

export function SupervisorsDataTable({
  user,
  role,
  stage,
  data,
}: {
  user: User;
  role: Role;
  stage: Stage;
  data: SupervisorData[];
}) {
  const params = useInstanceParams();
  const router = useRouter();

  const { mutateAsync: deleteAsync } = api.user.supervisor.delete.useMutation();
  const { mutateAsync: deleteAllAsync } =
    api.user.supervisor.deleteAll.useMutation();

  async function handleDelete(supervisorId: string) {
    void toast.promise(
      deleteAsync({ params, supervisorId }).then(() => router.refresh()),
      {
        loading: "Deleting Supervisor...",
        error: "Something went wrong",
        success: `Supervisor ${supervisorId} deleted successfully`,
      },
    );
  }

  async function handleDeleteAll() {
    void toast.promise(
      deleteAllAsync({ params }).then(() => router.refresh()),
      {
        loading: "Deleting Supervisor...",
        error: "Something went wrong",
        success: `All Supervisors deleted successfully`,
      },
    );
  }

  const primaryColumn: SearchableColumn = {
    id: "name",
    displayName: "Supervisor Names",
  };

  return (
    <DataTable
      searchableColumn={primaryColumn}
      className="w-full"
      columns={supervisorColumns(
        user,
        role,
        stage,
        handleDelete,
        handleDeleteAll,
      )}
      data={data}
    />
  );
}
