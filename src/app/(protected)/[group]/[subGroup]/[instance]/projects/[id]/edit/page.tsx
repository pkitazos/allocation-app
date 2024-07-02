import { Role, Stage } from "@prisma/client";

import { Heading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { stageGte } from "@/lib/utils/permissions/stage-check";
import { InstanceParams } from "@/lib/validations/params";

import { EditProjectForm } from "./_components/edit-project-form";

type PageParams = InstanceParams & { id: string };

export default async function Page({ params }: { params: PageParams }) {
  const projectId = params.id;

  const user = await api.user.get();
  const role = await api.user.role({ params });
  const stage = await api.institution.instance.currentStage({ params });

  const project = await api.project.getById({ projectId });

  if (role !== Role.ADMIN && user.id !== project.supervisor.id) {
    return (
      <Unauthorised message="You need to be an Admin to access this page" />
    );
  }

  if (stageGte(stage, Stage.PROJECT_ALLOCATION)) {
    return (
      <Unauthorised message="You are not allowed to access the platform at this time" />
    );
  }

  const formInternalData = await api.project.getFormDetails({ params });

  const projectDetails = {
    id: projectId,
    ...project,
    flagIds: project.flags.map((f) => f.id),
    capacityUpperBound: project.capacityUpperBound,
    preAllocatedStudentId: project.preAllocatedStudentId ?? "",
    isPreAllocated: project.preAllocatedStudentId !== "",
  };

  return (
    <PageWrapper>
      <Heading>Edit Project</Heading>
      <EditProjectForm
        formInternalData={formInternalData}
        project={projectDetails}
      />
    </PageWrapper>
  );
}
