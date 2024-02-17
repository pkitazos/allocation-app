"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { ProjectTableData, projectColumns } from "./projects-columns";
import { Role } from "@prisma/client";
import { User } from "next-auth";
import { api } from "@/lib/trpc/client";
import { toast } from "sonner";
import { useInstanceParams } from "@/components/params-context";
import { useRouter } from "next/navigation";

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
      className="w-full"
      columns={projectColumns(user, role, handleDelete, handleDeleteAll)}
      data={data}
    />
  );
}
