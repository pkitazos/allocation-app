"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      deleteAsync({ params, projectId }).then(() =>
        router.push(`${instancePath}/projects`),
      ),
      {
        loading: "Deleting Project...",
        error: "Something went wrong",
        success: "Success",
      },
    );
  }
  return (
    <Button onClick={handleDelete} variant="destructive">
      Delete Project
    </Button>
  );
}
