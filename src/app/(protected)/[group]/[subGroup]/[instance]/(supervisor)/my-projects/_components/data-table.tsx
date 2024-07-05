"use client";

import { Project, Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import DataTable from "@/components/ui/data-table/data-table";

import { api } from "@/lib/trpc/client";
import { SearchableColumn } from "@/lib/validations/table";

import { columns, SupervisorProjectData } from "./project-columns";

export function ProjectsDataTable({
  stage,
  projects,
}: {
  stage: Stage;
  projects: SupervisorProjectData[];
}) {
  const params = useInstanceParams();
  const router = useRouter();

  const { mutateAsync: deleteAsync } = api.project.delete.useMutation();
  const { mutateAsync: deleteAllAsync } = api.project.deleteAll.useMutation();

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

  async function handleDeleteAll() {
    void toast.promise(
      deleteAllAsync({ params }).then(() => router.refresh()),
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
      searchableColumn={primaryColumn}
      columns={columns(stage, handleDelete, handleDeleteAll)}
      data={projects}
    />
  );
}
