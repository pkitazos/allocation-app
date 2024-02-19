import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { ProjectInfo } from "@/lib/validations/allocation-adjustment";

export function ProjectCardTooltip({
  projectInfo,
}: {
  projectInfo?: ProjectInfo;
}) {
  const projectId = projectInfo?.id ?? 1927308170;
  const projectLowerBound = projectInfo?.capacityLowerBound ?? 0;
  const projectUpperBound = projectInfo?.capacityUpperBound ?? 0;

  const supervisorId = "fake supervisor ID";
  const supervisorLowerBound = projectInfo?.projectAllocationLowerBound ?? 0;
  const supervisorTarget = projectInfo?.projectAllocationTarget ?? 0;
  const supervisorUpperBound = projectInfo?.projectAllocationUpperBound ?? 0;

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <p className="-mb-1 text-muted-foreground">Project ID</p>
        <p className="text-lg font-semibold">{projectId}</p>
      </CardHeader>
      <CardContent className="-mt-1 flex flex-col gap-5">
        <div>
          <p className="text-muted-foreground">Supervisor ID</p>
          <p className="font-semibold">{supervisorId}</p>
        </div>
        <div className="grid grid-cols-2">
          <p className="col-span-2 mb-1 font-semibold">Project Capacities</p>
          <p className="col-span-1">Lower bound:</p>
          <p className="col-span-1 text-center">{projectLowerBound}</p>
          <p className="col-span-1">Upper bound:</p>
          <p className="col-span-1 text-center">{projectUpperBound}</p>
        </div>
        <div className="grid grid-cols-2">
          <p className="col-span-2 mb-1 font-semibold">Supervisor Capacities</p>
          <p className="col-span-1">Lower Bound:</p>
          <p className="col-span-1 text-center">{supervisorLowerBound}</p>
          <p className="col-span-1">Target:</p>
          <p className="col-span-1 text-center">{supervisorTarget}</p>
          <p className="col-span-1">Upper Bound:</p>
          <p className="col-span-1 text-center">{supervisorUpperBound}</p>
        </div>
      </CardContent>
    </Card>
  );
}
