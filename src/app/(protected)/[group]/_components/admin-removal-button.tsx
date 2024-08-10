"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { api } from "@/lib/trpc/client";
import { GroupParams } from "@/lib/validations/params";
import { YesNoAction } from "@/components/yes-no-action";

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

  // TODO maybe requires a better message?
  return (
    <YesNoAction
      action={handleRemoval}
      title="Remove Group Admin?"
      description="You are about to remove a group admin. Do you wish to proceed?"
      trigger={
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2Icon className="h-4 w-4" />
          <p>remove</p>
        </Button>
      }
    />
  );
}
