"use client";
import { AllocationInstance } from "@prisma/client";
import { MergeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/trpc/client";

import { spacesLabels } from "@/content/spaces";

export function MergeButton({
  forkedInstance,
  parentInstance,
}: {
  forkedInstance: AllocationInstance;
  parentInstance: AllocationInstance;
}) {
  const router = useRouter();
  const params = useInstanceParams();

  const { mutateAsync: mergeAsync } =
    api.institution.instance.merge.useMutation();

  async function handleClick() {
    void toast.promise(
      mergeAsync({ params }).then(() => {
        router.push(`/${params.group}/${params.subGroup}/${parentInstance.id}`);
        router.refresh();
      }),
      {
        loading: `Merging ${forkedInstance.displayName} into ${parentInstance.displayName}`,
        error: `Unable to merge ${spacesLabels.instance.short}s`,
        success: `Successfully merged ${forkedInstance.displayName} into ${parentInstance.displayName}`,
      },
    );
  }

  return (
    <Button onClick={handleClick} className="flex items-center gap-2" size="lg">
      <MergeIcon className="h-4 w-4" />
      <p>Merge</p>
    </Button>
  );
}
