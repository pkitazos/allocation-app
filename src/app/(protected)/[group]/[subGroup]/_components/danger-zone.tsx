"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DestructiveButton } from "@/components/destructive-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/lib/trpc/client";
import { SubGroupParams } from "@/lib/validations/params";

export function DangerZone({
  spaceLabel,
  params,
}: {
  spaceLabel: string;
  params: SubGroupParams;
}) {
  const router = useRouter();
  const { mutateAsync: deleteAsync } =
    api.institution.group.deleteSubGroup.useMutation();

  async function destructiveAction() {
    void toast.promise(
      deleteAsync({ params }).then(() => {
        router.push(`/${params.group}`);
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
