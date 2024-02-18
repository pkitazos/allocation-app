import { Stage } from "@prisma/client";

import { Heading } from "@/components/heading";
import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";
import { CreateProjectForm } from "./_components/create-project-form";
import { Unauthorised } from "@/components/unauthorised";

export default async function Page({ params }: { params: InstanceParams }) {
  const { flags, tags, students } =
    await api.institution.instance.project.creationDetails.query({ params });

  const stage = await api.institution.instance.currentStage.query({ params });

  if (stage !== Stage.PROJECT_SUBMISSION) {
    return (
      // TODO: handle late submissions
      <Unauthorised message="You really should not be submitting projects at this stage" />
    );
  }

  return (
    <div className="w-full max-w-5xl">
      <Heading>New Project</Heading>
      <div className="mx-10">
        <CreateProjectForm students={students} flags={flags} tags={tags} />
      </div>
    </div>
  );
}
