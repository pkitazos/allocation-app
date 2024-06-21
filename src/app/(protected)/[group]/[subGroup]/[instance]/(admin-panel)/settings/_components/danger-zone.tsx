"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DestructiveButton } from "@/components/destructive-button";
import { useInstanceParams } from "@/components/params-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/lib/trpc/client";

export function DangerZone({ spaceTitle }: { spaceTitle: string }) {
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
        loading: `Deleting ${spaceTitle}`,
        error: "Something went wrong",
        success: `Successfully deleted ${spaceTitle}`,
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
          Allocation {spaceTitle}
        </DestructiveButton>
        <p>
          Once you delete an Allocation {spaceTitle}, there is no going back.
        </p>
      </CardContent>
    </Card>
  );
}
