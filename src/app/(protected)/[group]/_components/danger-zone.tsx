"use client";
import { DestructiveButton } from "@/components/destructive-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/trpc/client";
import { GroupParams } from "@/lib/validations/params";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DangerZone({
  spaceTitle,
  params,
}: {
  spaceTitle: string;
  params: GroupParams;
}) {
  const router = useRouter();
  const { mutateAsync: deleteAsync } =
    api.institution.deleteGroup.useMutation();

  async function destructiveAction() {
    void toast.promise(
      deleteAsync({ params }).then(() => router.push(`/admin`)),
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
          {spaceTitle}
        </DestructiveButton>
        <p>
          Once you delete an Allocation {spaceTitle}, there is no going back.
        </p>
      </CardContent>
    </Card>
  );
}
