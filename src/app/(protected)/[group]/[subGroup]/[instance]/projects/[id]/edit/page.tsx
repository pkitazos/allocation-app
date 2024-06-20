import { Heading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { EditProjectForm } from "./_components/edit-project-form";
import { auth } from "@/lib/auth";
import { Role, Stage } from "@prisma/client";
import { stageCheck } from "@/lib/utils/permissions/stage-check";
import { Unauthorised } from "@/components/unauthorised";

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
  if (stageCheck(stage, Stage.PROJECT_ALLOCATION)) {
    return (
      <Unauthorised message="You are not allowed to access the platform at this time" />
    );
  }

  const { flags, tags, students } =
    await api.institution.instance.project.creationDetails({ params });

  const { capacityUpperBound, preAllocatedStudentId } =
    await api.project.getEditFormDetails({ projectId });

  const projectDetails = {
    id: projectId,
    ...project,
    capacityUpperBound,
    preAllocatedStudentId,
  };

  return (
    <PageWrapper>
      <Heading>Edit Project</Heading>
      <EditProjectForm
        project={projectDetails}
        flags={flags}
        tags={tags}
        students={students}
      />
    </PageWrapper>
  );
}
