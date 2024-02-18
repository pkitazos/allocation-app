"use client";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { Switch } from "@/components/ui/switch";

import { api } from "@/lib/trpc/client";

export function TogglePlatformAccess({
  platformAccess,
}: {
  platformAccess: boolean;
}) {
  const params = useInstanceParams();

  const { mutateAsync: toggleAsync } =
    api.institution.instance.toggleSupervisorPlatformAccess.useMutation();

  async function handleAccessChange() {
    void toast.promise(toggleAsync({ params, platformAccess }), {
      loading: "Giving Supervisors access...",
      error: "Something went wrong",
      success: "Success",
    });
  }

  return (
    <Switch
      defaultChecked={platformAccess}
      onCheckedChange={handleAccessChange}
    />
  );
}
