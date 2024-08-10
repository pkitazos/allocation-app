"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";

import { DangerZone } from "@/components/danger-zone";
import { api } from "@/lib/trpc/client";

export function DeleteConfirmation({ spaceLabel }: { spaceLabel: string }) {
  const params = useInstanceParams();
  const router = useRouter();

  const { group, subGroup, instance } = params;

  const { mutateAsync: deleteAsync } =
    api.institution.subGroup.deleteInstance.useMutation();

  async function destructiveAction() {
    void toast.promise(
      deleteAsync({ params }).then(() => {
        router.push(`/${group}/${subGroup}`);
        router.refresh();
      }),
      {
        loading: `Deleting ${spaceLabel}`,
        error: "Something went wrong",
        success: `Successfully deleted ${spaceLabel}`,
      },
    );
  }

  return (
    <DangerZone
      action={destructiveAction}
      spaceLabel={spaceLabel}
      name={instance}
    />
  );
}
