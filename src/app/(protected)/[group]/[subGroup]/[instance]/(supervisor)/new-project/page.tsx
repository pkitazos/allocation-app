import { Stage } from "@prisma/client";

import { Heading } from "@/components/heading";
import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";
import { CreateProjectForm } from "./_components/create-project-form";

export default async function Page({ params }: { params: InstanceParams }) {
  const stage = await api.institution.instance.currentStage.query({ params });

  if (stage !== Stage.PROJECT_SUBMISSION) return;

  return (
    <div className="w-full max-w-5xl">
      <Heading>New Project</Heading>
      <div className="mx-10">
        <CreateProjectForm />
      </div>
    </div>
  );
}
