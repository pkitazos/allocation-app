"use client";
import { PreferenceType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";
import { instanceParams } from "@/lib/validations/params";

export function MutationButton({
  params,
  projectId,
  updatedStatus,
  children,
}: {
  params: instanceParams;
  projectId: string;
  updatedStatus?: PreferenceType;
  children: ReactNode;
}) {
  const { refresh } = useRouter();

  const preferenceType = !updatedStatus
    ? "None"
    : z.nativeEnum(PreferenceType).parse(updatedStatus);

  const { mutateAsync: updateAsync } =
    api.user.student.preference.update.useMutation();

  const handleUpdate = () => {
    toast.promise(
      updateAsync({
        params,
        preferenceType,
        projectId,
      }).then(refresh),
      {
        loading: "Loading...",
        success: "Success",
        error: "Error",
      },
    );
  };

  return (
    <Button
      variant={preferenceType === "None" ? "destructive" : "default"}
      onClick={handleUpdate}
    >
      {children}
    </Button>
  );
}
