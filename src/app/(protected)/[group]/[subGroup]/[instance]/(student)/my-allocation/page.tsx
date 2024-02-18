import { Heading, SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { AllocatedProject } from "./allocated-project";

export default async function Page({ params }: { params: InstanceParams }) {
  const allocatedProject = await api.user.student.allocatedProject.query({
    params,
  });

  return (
    <>
      <Heading>My Allocations</Heading>
      <PanelWrapper>
        {!allocatedProject ? (
          <div className="mt-9 flex flex-col gap-4">
            <SubHeading>Allocations</SubHeading>
            <p>You have not been allocated any projects</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{allocatedProject.project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-start">
                {/* <p className="text-xl font-semibold">
                  {allocatedProject.project.title}
                </p> */}
                <p>{allocatedProject.project.description}</p>
                <p>{allocatedProject.studentRanking}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </PanelWrapper>
    </>
  );
}
