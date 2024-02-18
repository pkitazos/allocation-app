import { Heading, SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Calendar } from "@/components/ui/calendar";
import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";
import Layout from "./layout";
import { Stage } from "@prisma/client";

export async function SupervisorOverview({
  params,
}: {
  params: InstanceParams;
}) {
  const { displayName, projectSubmissionDeadline: deadline } =
    await api.user.supervisor.instancePage.query({
      params,
    });

  const { projects, submissionTarget } =
    await api.user.supervisor.projects.query({
      params,
    });

  const stage = await api.institution.instance.currentStage.query({ params });

  return (
    <Layout params={params}>
      <Heading>{displayName}</Heading>
      <PanelWrapper className="pt-6">
        {stage === Stage.PROJECT_SUBMISSION && (
          <div className="mt-9 flex justify-between">
            <div className="flex flex-col justify-start">
              <div className="flex flex-col gap-4">
                <SubHeading>Project Upload Deadline</SubHeading>
                <p className="text-xl">{deadline.toLocaleDateString()}</p>
              </div>
              <div className="mt-16 flex flex-col gap-4">
                <SubHeading>Task List</SubHeading>
                <ul className="ml-6 list-disc [&>li]:mt-2">
                  <li>
                    Submit {submissionTarget} projects{" "}
                    <span className="text-slate-600">
                      (currently submitted: {projects.length})
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
            />
          </div>
        )}
        {stage !== Stage.PROJECT_SUBMISSION &&
          stage !== Stage.ALLOCATION_PUBLICATION && (
            <div className="mt-9 flex flex-col gap-4">
              <SubHeading>Task List</SubHeading>
              <p>Nothing to do at this stage</p>
            </div>
          )}
        {stage === Stage.ALLOCATION_PUBLICATION && (
          <div className="mt-9 flex flex-col gap-4">
            <SubHeading>Allocations Released</SubHeading>
            <p className="text-lg">
              Check the &ldquo;My Allocations&rdquo; page to view your allocated
              projects
            </p>
          </div>
        )}
      </PanelWrapper>
    </Layout>
  );
}
