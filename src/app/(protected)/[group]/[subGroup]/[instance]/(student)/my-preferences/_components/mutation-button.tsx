"use client";
import { ReactNode } from "react";
import { PreferenceType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import { api } from "@/lib/trpc/client";
import { InstanceParams } from "@/lib/validations/params";

export function MutationButton({
  params,
  projectId,
  updatedStatus,
  children,
}: {
  params: InstanceParams;
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
