import { Heading, SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

export default async function Page({ params }: { params: InstanceParams }) {
  const allocations = await api.user.supervisor.allocations.query({ params });

  return (
    <>
      <Heading>My Allocations</Heading>
      <PanelWrapper>
        {allocations.length === 0 ? (
          <div className="mt-9 flex flex-col gap-4">
            <SubHeading>Allocations</SubHeading>
            <p>You have not been allocated any projects</p>
          </div>
        ) : (
          <div className="ml-10 mt-16 flex flex-col gap-6">
            {allocations.map(({ project, student }, i) => (
              <Card key={i} className="w-1/2">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <p className="text-lg">Student ID:</p>
                  <Badge variant="secondary" className="text-base">
                    {student.userId}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PanelWrapper>
    </>
  );
}
