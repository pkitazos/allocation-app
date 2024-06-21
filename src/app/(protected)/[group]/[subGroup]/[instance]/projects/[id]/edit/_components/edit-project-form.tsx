"use client";
import { Flag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { ProjectForm } from "@/components/project-form";
import { TagType } from "@/components/tag/tag-input";

import { api } from "@/lib/trpc/client";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import {
  CurrentProjectFormDetails,
  UpdatedProjectFormDetails,
} from "@/lib/validations/project-form";

import { ProjectRemovalButton } from "./project-removal-button";

export function EditProjectForm({
  flags,
  tags,
  students,
  project,
}: {
  flags: Pick<Flag, "id" | "title">[];
  tags: TagType[];
  students: { id: string }[];
  project: CurrentProjectFormDetails;
}) {
  const params = useInstanceParams();
  const router = useRouter();
  const instancePath = formatParamsAsPath(params);

  const { mutateAsync } = api.project.updateProjectDetails.useMutation();

  function onSubmit(data: UpdatedProjectFormDetails) {
    void toast.promise(
      mutateAsync({
        params,
        projectId: project.id,
        updatedProject: data,
      }).then(() => {
        router.push(`${instancePath}/projects/${project.id}`);
        router.refresh();
      }),
      {
        loading: `Updating Project ${project.id}...`,
        error: "Something went wrong",
        success: `Successfully updated Project ${project.id}`,
      },
    );
  }

  return (
    <ProjectForm
      flags={flags}
      tags={tags}
      students={students}
      project={project}
      submissionButtonLabel="Update Project"
      onSubmit={onSubmit}
    >
      <ProjectRemovalButton projectId={project.id} />
    </ProjectForm>
  );
}
