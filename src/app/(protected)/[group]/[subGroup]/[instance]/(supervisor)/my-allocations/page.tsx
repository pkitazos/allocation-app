import { Heading, SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

export default async function Page({ params }: { params: InstanceParams }) {
  const allocations = await api.user.supervisor.allocations({ params });

  return (
    <>
      <Heading>My Allocations</Heading>
      <PanelWrapper>
        {allocations.length === 0 ? (
          <div className="mt-9 flex flex-col gap-4">
            <SubHeading>Allocations</SubHeading>
            <p>You have not been allocated any students</p>
          </div>
        ) : (
          <div className="ml-10 mt-16 flex flex-col gap-6">
            {allocations.map(({ project, student }, i) => (
              <Card key={i} className="w-1/2">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-4 items-center justify-start gap-x-4 gap-y-2">
                  <p className="col-span-1 text-lg font-medium text-muted-foreground">
                    GUID
                  </p>
                  <Badge
                    variant="secondary"
                    className="col-span-3 w-max text-base"
                  >
                    {student.id}
                  </Badge>
                  <p className="col-span-1 text-lg font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="col-span-3 text-lg font-semibold">
                    {student.name}
                  </p>
                  <p className="col-span-1 text-lg font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="col-span-3 text-lg">{student.email}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PanelWrapper>
    </>
  );
}
