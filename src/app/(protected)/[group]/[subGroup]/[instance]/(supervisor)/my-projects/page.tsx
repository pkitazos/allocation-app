import { Role } from "@prisma/client";

import { Heading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Card } from "@/components/ui/card";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { cn } from "@/lib/utils";
import { InstanceParams } from "@/lib/validations/params";

import { ProjectsDataTable } from "./_components/data-table";

export default async function Page({ params }: { params: InstanceParams }) {
  const role = await api.user.role.query({ params });

  if (role !== Role.SUPERVISOR) {
    return (
      <Unauthorised message="You need to be a Supervisor to access this page" />
    );
  }

  const stage = await api.institution.instance.currentStage.query({ params });

  const { projects, submissionTarget } =
    await api.user.supervisor.projects.query({
      params,
    });

  return (
    <>
      <Heading>My Projects</Heading>
      <PanelWrapper className="pt-6">
        <Card className="flex justify-between px-10 py-5">
          <h2
            className={cn(
              "text-lg font-medium",
              submissionTarget <= 0 && "text-muted-foreground line-through",
            )}
          >
            Submission Target
          </h2>
          {submissionTarget > 0 && (
            <p
              className={cn(
                "text-lg font-medium",
                projects.length < submissionTarget && "text-destructive",
                projects.length >= submissionTarget && "text-green-500",
              )}
            >
              {projects.length} / {submissionTarget}
            </p>
          )}
        </Card>
        <ProjectsDataTable stage={stage} projects={projects} />
      </PanelWrapper>
    </>
  );
}
