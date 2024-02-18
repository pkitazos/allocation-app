"use client";

import DataTable from "@/components/ui/data-table/data-table";
import { Project } from "@prisma/client";
import { columns } from "./project-columns";
import { api } from "@/lib/trpc/client";
import { toast } from "sonner";
import { useInstanceParams } from "@/components/params-context";
import { useRouter } from "next/navigation";

export function ProjectsDataTable({
  projects,
}: {
  projects: Pick<
    Project,
    "id" | "title" | "capacityLowerBound" | "capacityUpperBound"
  >[];
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
  return (
    <DataTable
      columns={columns(handleDelete, handleDeleteAll)}
      data={projects}
    />
  );
}
