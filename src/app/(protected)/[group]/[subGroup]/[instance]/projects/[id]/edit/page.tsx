import { Role, Stage } from "@prisma/client";

import { Heading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { makeRequiredFlags } from "@/lib/utils/general/make-required-flags";
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
      <Unauthorised message="You are not allowed to edit projects at this time" />
    );
  }

  const { takenTitles, ...rest } = await api.project.getFormDetails({
    params,
    projectId,
  });
  const availableTitles = takenTitles.filter((t) => t !== project.title);
  const formInternalData = { takenTitles: availableTitles, ...rest };

  const projectDetails = {
    id: projectId,
    ...project,
    flagTitles: project.flags.map((f) => f.title),
    capacityUpperBound: project.capacityUpperBound,
    preAllocatedStudentId: project.preAllocatedStudentId ?? "",
    isPreAllocated: project.preAllocatedStudentId !== "",
  };

  const isForked = await api.project.getIsForked({ params, projectId });

  const instanceFlags = await api.institution.instance.getFlags({ params });
  const requiredFlags = makeRequiredFlags(instanceFlags);

  return (
    <PageWrapper>
      <Heading>Edit Project</Heading>
      <EditProjectForm
        formInternalData={formInternalData}
        project={projectDetails}
        isForked={isForked}
        requiredFlags={requiredFlags}
      />
    </PageWrapper>
  );
}
