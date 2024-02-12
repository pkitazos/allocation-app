"use client";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/trpc/client";
import { instanceParams } from "@/lib/validations/params";
import { toast } from "sonner";

export function TogglePlatformAccess({
  params,
  platformAccess,
}: {
  params: instanceParams;
  platformAccess: boolean;
}) {
  const { mutateAsync: toggleAsync } =
    api.institution.instance.toggleStudentPlatformAccess.useMutation();

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
