"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";
import { GroupParams } from "@/lib/validations/params";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminRemovalButton({
  params,
  userId,
}: {
  params: GroupParams;
  userId: string;
}) {
  const router = useRouter();

  const { mutateAsync } = api.institution.group.removeAdmin.useMutation();

  //   const utils = api.useUtils();

  //   const refetch = () =>
  //     utils.institution.group.subGroupManagement.refetch({ params });

  function handleRemoval() {
    void toast.promise(
      mutateAsync({ params, userId }).then(() => router.refresh()),
      {
        loading: "Removing Group Admin",
        error: "Something went wrong",
        success: "Success",
      },
    );
  }

  return (
    <Button
      variant="destructive"
      className="flex items-center gap-2"
      onClick={handleRemoval}
    >
      <Trash2 className="h-4 w-4" />
      <p>remove</p>
    </Button>
  );
}
