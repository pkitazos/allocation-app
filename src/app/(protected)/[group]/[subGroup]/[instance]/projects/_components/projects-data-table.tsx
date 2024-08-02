"use client";
import { Role } from "@prisma/client";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import DataTable from "@/components/ui/data-table/data-table";

import { api } from "@/lib/trpc/client";
import { SearchableColumn } from "@/lib/validations/table";

import { constructColumns, ProjectTableData } from "./projects-columns";

export function ProjectsDataTable({
  data,
  user,
  role,
}: {
  data: ProjectTableData[];
  user: User;
  role: Role;
}) {
  const params = useInstanceParams();
  const router = useRouter();

  const { mutateAsync: deleteAsync } = api.project.delete.useMutation();
  const { mutateAsync: deleteAllAsync } =
    api.project.deleteSelected.useMutation();

  async function handleDelete(projectId: string) {
    void toast.promise(
      deleteAsync({ params, projectId }).then(() => router.refresh()),
      {
        loading: "Deleting project...",
        error: "Something went wrong",
        success: `Successfully deleted project ${projectId}`,
      },
    );
  }

  async function handleDeleteSelected(projectIds: string[]) {
    void toast.promise(
      deleteAllAsync({ params, projectIds }).then(() => router.refresh()),
      {
        loading: "Deleting selected projects...",
        error: "Something went wrong",
        success: `Successfully deleted ${projectIds.length} projects`,
      },
    );
  }

  const primaryColumn: SearchableColumn = {
    id: "title",
    displayName: "Project Titles",
  };

  const columns = constructColumns({
    user,
    role,
    deleteProject: handleDelete,
    deleteSelectedProjects: handleDeleteSelected,
  });

  return (
    <DataTable
      searchableColumn={primaryColumn}
      className="w-full"
      columns={columns}
      data={data}
    />
  );
}
