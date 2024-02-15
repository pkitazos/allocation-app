"use client";
import { DestructiveButton } from "@/components/destructive-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/trpc/client";
import { subGroupParams } from "@/lib/validations/params";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export function DangerZone({
  spaceTitle,
  params,
}: {
  spaceTitle: string;
  params: subGroupParams;
}) {
  const router = useRouter();
  const { mutateAsync: deleteAsync } =
    api.institution.group.deleteSubGroup.useMutation();

  async function destructiveAction() {
    void toast.promise(
      deleteAsync({ params }).then(() => router.push(`/${params.group}`)),
      {
        loading: "Deleting Sub-Group",
        error: "Something went wrong",
        success: "Successfully deleted Sub-Group",
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
          {spaceTitle}
        </DestructiveButton>
        <p>
          Once you delete an Allocation {spaceTitle}, there is no going back.
        </p>
      </CardContent>
    </Card>
  );
}
