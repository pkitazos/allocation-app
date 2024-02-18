import { Heading } from "@/components/heading";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

export async function AllocatedProject({ params }: { params: InstanceParams }) {
  const allocatedProject = await api.user.student.allocatedProject.query({
    params,
  });

  if (!allocatedProject)
    return (
      <section className="flex w-2/3 max-w-7xl flex-col">
        <Heading>Project Allocation</Heading>
        <p className="grid h-full place-items-center text-lg">
          You have not been allocated a project. Please contact the instance
          administrator
        </p>
      </section>
    );

  return (
    <section className="flex w-2/3 max-w-7xl flex-col">
      <Heading>Project Allocation</Heading>
      <div className="grid h-full place-items-center text-lg">
        <div className="flex flex-col items-start">
          <p className="text-xl font-semibold">
            {allocatedProject.project.title}
          </p>
          <p>{allocatedProject.project.description}</p>
          <p>{allocatedProject.studentRanking}</p>
        </div>
      </div>
    </section>
  );
}
