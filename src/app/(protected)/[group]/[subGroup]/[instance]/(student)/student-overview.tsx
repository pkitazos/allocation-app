import { Stage } from "@prisma/client";
import { format } from "date-fns";
import { ReactNode } from "react";

import { Heading, SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Calendar } from "@/components/ui/calendar";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";

import { InstanceParams } from "@/lib/validations/params";

import Layout from "./layout";

export async function StudentOverview({ params }: { params: InstanceParams }) {
  const stage = await api.institution.instance.currentStage({ params });

  const {
    displayName,
    preferenceSubmissionDeadline: deadline,
    deadlineTimeZoneOffset: timeZoneOffset,
  } = await api.user.student.overviewData({
    params,
  });

  const { minPreferences, maxPreferences } =
    await api.user.student.preferenceRestrictions({
      params,
    });
  if (stage === Stage.PROJECT_SELECTION) {
    const preAllocatedTitle = await api.user.student.isPreAllocated({ params });
    if (preAllocatedTitle !== null) {
      return (
        <ThinLayout pageName={displayName} params={params}>
          <div className="mt-9 flex justify-between">
            <div className="flex flex-col justify-start">
              <div className="flex flex-col gap-4">
                <p className="flex gap-2">
                You are allocated to your self-defined project titled "{preAllocatedTitle}" and do not need to submit preferences.
                </p>
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
    return (
      <ThinLayout pageName={displayName} params={params}>
        <div className="mt-9 flex justify-between">
          <div className="flex flex-col justify-start">
            <div className="flex flex-col gap-4">
              <SubHeading>Preference List Submission Deadline</SubHeading>
              <p className="flex gap-2 text-xl">
                {format(deadline, "dd MMM yyyy - HH:mm")}
                <span className="text-muted-foreground">{timeZoneOffset}</span>
              </p>
            </div>
            <div className="mt-16 flex flex-col gap-4">
              <SubHeading>Task List</SubHeading>
              <ul className="ml-6 list-disc [&>li]:mt-2">
                <li>
                  Submit your preference list{" "}
                  <span className="text-muted-foreground">
                    (between {minPreferences} and {maxPreferences} inclusive)
                  </span>
                </li>
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
    stage === Stage.ALLOCATION_ADJUSTMENT ||
    stage === Stage.PROJECT_ALLOCATION
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
            Check the &ldquo;My Allocation&rdquo; page to view your allocated
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
