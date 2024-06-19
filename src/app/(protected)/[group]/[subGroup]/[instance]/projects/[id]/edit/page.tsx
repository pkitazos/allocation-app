import { InstanceParams } from "@/lib/validations/params";
import { EditProjectForm } from "./_components/edit-project-form";
import { api } from "@/lib/trpc/server";

type PageParams = InstanceParams & { id: string };

export default async function Page({ params }: { params: PageParams }) {
  //   TODO: check that user trying to access this is an admin or the project supervisor
  const { flags, tags, students } =
    await api.institution.instance.project.creationDetails({ params });

  const project = await api.project.getById({ projectId: params.id });
  return (
    <>
      <EditProjectForm
        project={project}
        flags={flags}
        tags={tags}
        students={students}
      />
    </>
  );
}
