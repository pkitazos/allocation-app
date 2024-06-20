"use client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// import { DestructiveButton } from "@/components/destructive-button";
import {
  useInstanceParams,
  useInstancePath,
} from "@/components/params-context";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/trpc/client";

export function ProjectRemovalButton({ projectId }: { projectId: string }) {
  const params = useInstanceParams();
  const router = useRouter();
  const instancePath = useInstancePath();

  const { mutateAsync: deleteAsync } = api.project.delete.useMutation();

  function handleDelete() {
    void toast.promise(
      deleteAsync({ params, projectId }).then(() => {
        router.push(`${instancePath}/my-projects`);
        router.refresh();
      }),
      {
        loading: "Deleting Project...",
        error: "Something went wrong",
        success: "Success",
      },
    );
  }
  return (
    <Button
      className="flex items-center gap-2"
      variant="destructive"
      size="lg"
      onClick={handleDelete}
      type="button"
    >
      <Trash2 className="h-4 w-4" />
      <p>Delete Project</p>
    </Button>
  );
}
