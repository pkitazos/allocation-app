"use client";
import { PreferenceType, Role, Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import DataTable from "@/components/ui/data-table/data-table";

import { api } from "@/lib/trpc/client";
import { StudentPreferenceType } from "@/lib/validations/student-preference";
import { SearchableColumn } from "@/lib/validations/table";

import {
  PreferenceData,
  studentPreferenceColumns,
} from "./student-preference-columns";

export function StudentPreferenceDataTable({
  role,
  stage,
  data,
  studentId,
}: {
  role: Role;
  stage: Stage;
  data: PreferenceData[];
  studentId: string;
}) {
  const params = useInstanceParams();
  const router = useRouter();

  const { mutateAsync: changePreferenceAsync } =
    api.user.student.preference.change.useMutation();

  const { mutateAsync: changeAllPreferencesAsync } =
    api.user.student.preference.changeAll.useMutation();

  async function changePreference(
    newPreferenceType: StudentPreferenceType,
    projectId: string,
  ) {
    void toast.promise(
      changePreferenceAsync({
        params,
        newPreferenceType,
        projectId,
        studentId,
      }).then(() => router.refresh()),
      {
        loading: "Updating project preference...",
        error: "Something went wrong",
        success: `Project ${projectId} preference updated successfully`,
      },
    );
  }

  async function changeAllPreferences(
    newPreferenceType: StudentPreferenceType,
  ) {
    void toast.promise(
      changeAllPreferencesAsync({
        params,
        newPreferenceType,
        studentId,
      }).then(() => router.refresh()),
      {
        loading: "Updating all project preferences...",
        error: "Something went wrong",
        success: "All project preferences updated successfully",
      },
    );
  }

  const primaryColumn: SearchableColumn = {
    id: "Project Title",
    displayName: "Project Title",
  };

  return (
    <DataTable
      searchableColumn={primaryColumn}
      className="w-full"
      columns={studentPreferenceColumns(
        role,
        stage,
        changePreference,
        changeAllPreferences,
      )}
      data={data}
    />
  );
}
