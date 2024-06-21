"use client";
import { Flag } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { ProjectForm } from "@/components/project-form";
import { TagType } from "@/components/tag/tag-input";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/trpc/client";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { UpdatedProjectFormDetails } from "@/lib/validations/project-form";

export function CreateProjectForm({
  flags,
  tags,
  students,
}: {
  flags: Pick<Flag, "id" | "title">[];
  tags: TagType[];
  students: { id: string }[];
}) {
  const params = useInstanceParams();
  const router = useRouter();
  const instancePath = formatParamsAsPath(params);

  const { mutateAsync } = api.user.supervisor.createProject.useMutation();

  const onSubmit = (data: UpdatedProjectFormDetails) => {
    void toast.promise(
      mutateAsync({
        params,
        newProject: data,
      }).then(() => {
        router.push(`${instancePath}/my-projects`);
        router.refresh();
      }),
      {
        loading: "Creating Project...",
        error: "Something went wrong",
        success: "Success",
      },
    );
  };

  return (
    <ProjectForm
      flags={flags}
      tags={tags}
      students={students}
      submissionButtonLabel="Create New Project"
      onSubmit={onSubmit}
    >
      <Button variant="outline" size="lg" type="button" asChild>
        <Link href={`${instancePath}/my-projects`}>Cancel</Link>
      </Button>
    </ProjectForm>
  );
}
