import { Heading, SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
          allocations.map((e, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{e.projectId}</CardTitle>
                <CardTitle>{e.userId}</CardTitle>
              </CardHeader>
            </Card>
          ))
        )}
      </PanelWrapper>
    </>
  );
}
