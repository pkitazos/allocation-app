"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { SupervisorData, supervisorColumns } from "./supervisors-columns";
import { User } from "next-auth";
import { Role } from "@prisma/client";
import { useInstanceParams } from "@/components/params-context";
import { api } from "@/lib/trpc/client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SupervisorsDataTable({
  data,
  user,
  role,
}: {
  data: SupervisorData[];
  user: User;
  role: Role;
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

  return (
    <DataTable
      className="w-full"
      columns={supervisorColumns(user, role, handleDelete, handleDeleteAll)}
      data={data}
    />
  );
}
