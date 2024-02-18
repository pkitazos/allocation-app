import { Role } from "@prisma/client";

import { Heading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Card } from "@/components/ui/card";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { ProjectsDataTable } from "./_components/data-table";

export default async function Page({ params }: { params: InstanceParams }) {
  const role = await api.user.role.query({ params });

  if (role !== Role.SUPERVISOR) {
    return (
      <Unauthorised message="You need to be a Supervisor to access this page" />
    );
  }

  const { projects, submissionTarget } =
    await api.user.supervisor.projects.query({
      params,
    });

  return (
    <>
      <Heading>My Projects</Heading>
      <PanelWrapper className="pt-6">
        <Card className="flex justify-between px-10 py-5">
          <h2 className="text-lg font-medium">Submission Target</h2>
          <p className="text-lg">
            {projects.length} / {submissionTarget}
          </p>
        </Card>
        <ProjectsDataTable projects={projects} />
      </PanelWrapper>
    </>
  );
}
