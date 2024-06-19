"use client";
import { Role, Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import DataTable from "@/components/ui/data-table/data-table";

import { api } from "@/lib/trpc/client";
import { SearchableColumn } from "@/lib/validations/table";

import {
  SupervisorProjectData,
  supervisorProjectsColumns,
} from "./supervisor-projects-columns";

export function SupervisorProjectsDataTable({
  user,
  role,
  stage,
  data,
  supervisorId,
}: {
  user: User;
  role: Role;
  stage: Stage;
  supervisorId: string;
  data: SupervisorProjectData[];
}) {
  const params = useInstanceParams();
  const router = useRouter();

  const { mutateAsync: deleteAsync } = api.project.delete.useMutation();
  const { mutateAsync: deleteSelectedAsync } =
    api.project.deleteSelected.useMutation();

  async function handleDelete(projectId: string) {
    void toast.promise(
      deleteAsync({ params, projectId }).then(() => router.refresh()),
      {
        loading: "Deleting Project...",
        error: "Something went wrong",
        success: `Project ${projectId} deleted successfully`,
      },
    );
  }

  async function handleDeleteAll(projectIds: string[]) {
    void toast.promise(
      deleteSelectedAsync({ params, projectIds }).then(() => router.refresh()),
      {
        loading: "Deleting Project...",
        error: "Something went wrong",
        success: `All Projects deleted successfully`,
      },
    );
  }

  const primaryColumn: SearchableColumn = {
    id: "title",
    displayName: "Project Titles",
  };

  return (
    <DataTable
      className="w-full"
      searchableColumn={primaryColumn}
      columns={supervisorProjectsColumns(
        user,
        role,
        stage,
        supervisorId,
        handleDelete,
        handleDeleteAll,
      )}
      data={data}
    />
  );
}
