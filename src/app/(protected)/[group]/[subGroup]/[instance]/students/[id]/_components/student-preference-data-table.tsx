"use client";
import { PreferenceType, Role, Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import DataTable from "@/components/ui/data-table/data-table";

import { api } from "@/lib/trpc/client";
import { SearchableColumn } from "@/lib/validations/table";

import {
  PreferenceData,
  studentPreferenceColumns,
} from "./student-preference-columns";

export function StudentPreferenceDataTable({
  role,
  stage,
  data,
}: {
  role: Role;
  stage: Stage;
  data: PreferenceData[];
}) {
  const params = useInstanceParams();
  const router = useRouter();

  const { mutateAsync: changePreferenceAsync } =
    api.user.student.preference.update.useMutation();

  async function handleChangePreference(
    preferenceType: PreferenceType,
    projectId: string,
  ) {
    void toast.promise(
      changePreferenceAsync({ params, preferenceType, projectId }).then(() =>
        router.refresh(),
      ),
      {
        loading: "Updating project preference...",
        error: "Something went wrong",
        success: `Project ${projectId} preference updated successfully`,
      },
    );
  }

  async function handleDeleteAll() {
    // void toast.promise(
    //   deleteAllAsync({ params }).then(() => router.refresh()),
    //   {
    //     loading: "Deleting Project...",
    //     error: "Something went wrong",
    //     success: `All Students deleted successfully`,
    //   },
    // );
  }

  const primaryColumn: SearchableColumn = {
    id: "name",
    displayName: "Student Names",
  };

  return (
    <DataTable
      searchableColumn={primaryColumn}
      className="w-full"
      columns={studentPreferenceColumns(
        role,
        stage,
        handleChangePreference,
        handleDeleteAll,
      )}
      data={data}
    />
  );
}
