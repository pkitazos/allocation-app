"use client";
import { Role, Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import DataTable from "@/components/ui/data-table/data-table";

import { api } from "@/lib/trpc/client";
import { SearchableColumn } from "@/lib/validations/table";

import { StudentData, studentsColumns } from "./students-columns";

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
  const { mutateAsync: deleteAllAsync } =
    api.user.student.deleteAll.useMutation();

  async function handleDelete(studentId: string) {
    void toast.promise(
      deleteAsync({ params, studentId }).then(() => router.refresh()),
      {
        loading: "Deleting Student...",
        error: "Something went wrong",
        success: `Student ${studentId} deleted successfully`,
      },
    );
  }

  async function handleDeleteAll() {
    void toast.promise(
      deleteAllAsync({ params }).then(() => router.refresh()),
      {
        loading: "Deleting Project...",
        error: "Something went wrong",
        success: `All Students deleted successfully`,
      },
    );
  }

  const primaryColumn: SearchableColumn = {
    id: "name",
    displayName: "Student Names",
  };

  return (
    <DataTable
      searchableColumn={primaryColumn}
      className="w-full"
      columns={studentsColumns(role, stage, handleDelete, handleDeleteAll)}
      data={data}
    />
  );
}
