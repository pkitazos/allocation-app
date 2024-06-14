"use client";
import { ChangePreferenceButton } from "@/components/change-preference-button";
import { useInstanceParams } from "@/components/params-context";
import { api } from "@/lib/trpc/client";
import { StudentPreferenceType } from "@/lib/validations/student-preference";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export function StudentPreferenceButton({
  projectId,
  defaultStatus,
}: {
  projectId: string;
  defaultStatus: StudentPreferenceType;
}) {
  const router = useRouter();
  const params = useInstanceParams();

  const { mutateAsync: updateAsync } =
    api.user.student.preference.update.useMutation();

  async function handleChange(preferenceType: StudentPreferenceType) {
    void toast.promise(
      updateAsync({
        params,
        projectId,
        preferenceType,
      }).then(() => router.refresh()),
      {
        loading: `Updating preference for Project ${projectId}...`,
        error: "Something went wrong",
        success: "Successfully updated preference",
      },
    );
  }

  return (
    <ChangePreferenceButton
      defaultStatus={defaultStatus}
      changeFunction={handleChange}
    />
  );
}
