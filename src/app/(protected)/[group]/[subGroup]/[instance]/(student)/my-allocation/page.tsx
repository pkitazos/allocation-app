import { Heading, SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { api } from "@/lib/trpc/server";
import { toPositional } from "@/lib/utils/general/to-positional";
import { instanceTabs } from "@/lib/validations/instance-tabs";
import { InstanceParams } from "@/lib/validations/params";

export default async function Page({ params }: { params: InstanceParams }) {
  const allocatedProject = await api.user.student.allocatedProject({ params });

  return (
    <>
      <Heading>{instanceTabs.myAllocation.title}</Heading>
      <PanelWrapper className="px-16">
        {!allocatedProject ? (
          <div className="mt-9 flex flex-col gap-4">
            <SubHeading>Allocation</SubHeading>
            <p>You have not been allocated a project</p>
          </div>
        ) : (
          <div className="mt-16 flex flex-col gap-8">
            <SubHeading className="text-2xl no-underline">
              You got your{" "}
              <span className="font-semibold text-secondary">
                {toPositional(allocatedProject.studentRanking)}
              </span>{" "}
              choice
            </SubHeading>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{allocatedProject.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 text-lg">
                    <p className="text-muted-foreground">Supervisor:</p>
                    <p className="text-xl font-medium">
                      {allocatedProject.supervisor.name}
                    </p>
                  </div>
                  <Separator className="my-6" />
                  <p>{allocatedProject.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </PanelWrapper>
    </>
  );
}
