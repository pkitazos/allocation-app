import { Heading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { EditProjectForm } from "./_components/edit-project-form";

type PageParams = InstanceParams & { id: string };

export default async function Page({ params }: { params: PageParams }) {
  //   TODO: check that user trying to access this is an admin or the project supervisor

  const projectId = params.id;

  const { flags, tags, students } =
    await api.institution.instance.project.creationDetails({ params });

  const project = await api.project.getById({ projectId });

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
