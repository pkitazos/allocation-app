"use client";
import { Role, Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import DataTable from "@/components/ui/data-table/data-table";

import { api } from "@/lib/trpc/client";
import { SearchableColumn } from "@/lib/validations/table";

import { StudentData, studentsColumns } from "./students-columns";
import { spacesLabels } from "@/content/spaces";

export function StudentsDataTable({
  role,
  stage,
  data,
}: {
  role: Role;
  stage: Stage;
  data: StudentData[];
}) {
  const params = useInstanceParams();
  const router = useRouter();

  const { mutateAsync: deleteAsync } = api.user.student.delete.useMutation();
  const { mutateAsync: deleteSelectedAsync } =
    api.user.student.deleteSelected.useMutation();

  async function handleDelete(studentId: string) {
    void toast.promise(
      deleteAsync({ params, studentId }).then(() => router.refresh()),
      {
        loading: `Removing Student from this ${spacesLabels.instance.short}...`,
        error: "Something went wrong",
        success: `Student ${studentId} deleted successfully`,
      },
    );
  }

  async function handleDeleteSelected(studentIds: string[]) {
    void toast.promise(
      deleteSelectedAsync({ params, studentIds }).then(() => router.refresh()),
      {
        loading: `Removing Students from this ${spacesLabels.instance.short}...`,
        error: "Something went wrong",
        success: `Successfully removed ${studentIds.length} students`,
      },
    );
  }

  const primaryColumn: SearchableColumn = {
    id: "Name",
    displayName: "Student Names",
  };

  return (
    <DataTable
      searchableColumn={primaryColumn}
      className="w-full"
      columns={studentsColumns(role, stage, handleDelete, handleDeleteSelected)}
      data={data}
    />
  );
}
