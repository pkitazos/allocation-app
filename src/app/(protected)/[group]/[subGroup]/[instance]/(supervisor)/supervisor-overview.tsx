import { ReactNode } from "react";
import { Stage } from "@prisma/client";
import { format } from "date-fns";

import { Heading, SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Calendar } from "@/components/ui/calendar";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import Layout from "./layout";

export async function SupervisorOverview({
  params,
}: {
  params: InstanceParams;
}) {
  const stage = await api.institution.instance.currentStage({ params });

  const { displayName, projectSubmissionDeadline: deadline } =
    await api.user.supervisor.instancePage({
      params,
    });

  const { currentSubmissionCount, submissionTarget } =
    await api.user.supervisor.projects({
      params,
    });

  if (stage === Stage.PROJECT_SUBMISSION) {
    return (
      <ThinLayout pageName={displayName} params={params}>
        <div className="mt-9 flex justify-between">
          <div className="flex flex-col justify-start">
            <div className="flex flex-col gap-4">
              <SubHeading>Project Upload Deadline</SubHeading>
              <p className="flex gap-2 text-xl">
                {format(deadline, "dd MMM yyyy")}
                {" - "}
                {format(deadline, "HH:mm")}
                <span className="text-muted-foreground">GMT</span>
              </p>
            </div>
            <div className="mt-16 flex flex-col gap-4">
              <SubHeading>Task List</SubHeading>
              <ul className="ml-6 list-disc [&>li]:mt-2">
                <li>
                  Submit {submissionTarget} projects{" "}
                  <span className="text-muted-foreground">
                    (currently submitted: {currentSubmissionCount})
                  </span>
                </li>
                <li>Submit any self-defined projects</li>
              </ul>
            </div>
          </div>
          <Calendar
            className="rounded-md border"
            mode="single"
            selected={deadline}
            defaultMonth={deadline}
          />
        </div>
      </ThinLayout>
    );
  }

  if (
    stage === Stage.PROJECT_SELECTION ||
    stage === Stage.PROJECT_ALLOCATION ||
    stage === Stage.ALLOCATION_ADJUSTMENT
  ) {
    return (
      <ThinLayout pageName={displayName} params={params}>
        <div className="mt-9 flex flex-col gap-4">
          <SubHeading>Task List</SubHeading>
          <p>Nothing to do at this stage</p>
        </div>
      </ThinLayout>
    );
  }

  if (stage === Stage.ALLOCATION_PUBLICATION) {
    return (
      <ThinLayout pageName={displayName} params={params}>
        <div className="mt-9 flex flex-col gap-4">
          <SubHeading>Allocations Released</SubHeading>
          <p className="text-lg">
            Check the &ldquo;My Allocations&rdquo; page to view your allocated
            projects
          </p>
        </div>
      </ThinLayout>
    );
  }

  return (
    <Unauthorised message="You are not allowed to access the platform at this time" />
  );
}

function ThinLayout({
  params,
  pageName,
  children,
}: {
  params: InstanceParams;
  pageName: string;
  children: ReactNode;
}) {
  return (
    <Layout params={params}>
      <Heading>{pageName}</Heading>
      <PanelWrapper className="pt-6">{children}</PanelWrapper>
    </Layout>
  );
}
