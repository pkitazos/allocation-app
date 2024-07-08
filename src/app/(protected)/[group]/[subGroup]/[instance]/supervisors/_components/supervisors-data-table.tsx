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
import { spacesLabels } from "@/content/spaces";

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
  const { mutateAsync: deleteSelectedAsync } =
    api.user.supervisor.deleteSelected.useMutation();

  async function handleDelete(supervisorId: string) {
    void toast.promise(
      deleteAsync({ params, supervisorId }).then(() => router.refresh()),
      {
        loading: `Removing Supervisor ${supervisorId} from ${spacesLabels.instance.short}...`,
        error: "Something went wrong",
        success: `Supervisor ${supervisorId} deleted successfully`,
      },
    );
  }

  async function handleDeleteSelected(supervisorIds: string[]) {
    void toast.promise(
      deleteSelectedAsync({ params, supervisorIds }).then(() =>
        router.refresh(),
      ),
      {
        loading: `Removing ${supervisorIds.length} supervisors from ${spacesLabels.instance.short}...`,
        error: "Something went wrong",
        success: `Successfully removed ${supervisorIds.length} Supervisors from ${spacesLabels.instance.short}`,
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
        handleDeleteSelected,
      )}
      data={data}
    />
  );
}
