"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { ProjectForm } from "@/components/project-form";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/trpc/client";
import { User } from "@/lib/validations/auth";
import {
  FormInternalData,
  UpdatedProject,
} from "@/lib/validations/project-form";

export function CreateProjectForm({
  formInternalData,
  supervisor,
  requiredFlags,
  createdByAdmin = false,
}: {
  formInternalData: FormInternalData;
  supervisor: User;
  requiredFlags: string[];
  createdByAdmin?: boolean;
}) {
  const params = useInstanceParams();
  const router = useRouter();

  const { mutateAsync } = api.project.create.useMutation();

  const onSubmit = (data: UpdatedProject) => {
    void toast.promise(
      mutateAsync({
        params,
        supervisorId: supervisor.id,
        newProject: data,
      }).then(() => {
        router.push(createdByAdmin ? "." : "./my-projects");
        router.refresh();
      }),
      {
        loading: "Creating Project...",
        error: "Something went wrong",
        success: "Successfully created new project",
      },
    );
  };

  return (
    <ProjectForm
      formInternalData={formInternalData}
      submissionButtonLabel="Create New Project"
      onSubmit={onSubmit}
      requiredFlags={requiredFlags}
    >
      <Button variant="outline" size="lg" type="button" asChild>
        <Link className="w-32" href={`./my-projects`}>
          Cancel
        </Link>
      </Button>
    </ProjectForm>
  );
}
