"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DestructiveButton } from "@/components/destructive-button";
import { useInstanceParams } from "@/components/params-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/lib/trpc/client";

export function DangerZone({ spaceLabel }: { spaceLabel: string }) {
  const params = useInstanceParams();
  const router = useRouter();

  const { group, subGroup } = params;

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
    <Card>
      <CardHeader>
        <CardTitle className="text-red-600">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-5">
        <DestructiveButton action={destructiveAction}>
          {spaceLabel}
        </DestructiveButton>
        <p>Once you delete an {spaceLabel}, there is no going back.</p>
      </CardContent>
    </Card>
  );
}
