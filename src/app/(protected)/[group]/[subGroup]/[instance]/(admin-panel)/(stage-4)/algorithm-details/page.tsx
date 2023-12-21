import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/trpc/server";
import { ServerResponseData } from "@/server/routers/algorithm";

export default async function Page({
  params: { group: groupId, subGroup: subGroupId, instance: instanceId },
}: {
  params: { group: string; subGroup: string; instance: string };
}) {
  const generousData = await api.institution.instance.getAlgorithmResult.query({
    algName: "generous",
    groupId,
    subGroupId,
    instanceId,
  });

  const greedyData = await api.institution.instance.getAlgorithmResult.query({
    algName: "greedy",
    groupId,
    subGroupId,
    instanceId,
  });

  const minCostData = await api.institution.instance.getAlgorithmResult.query({
    algName: "minimum-cost",
    groupId,
    subGroupId,
    instanceId,
  });

  const greedyGenData = await api.institution.instance.getAlgorithmResult.query(
    {
      algName: "greedy-generous",
      groupId,
      subGroupId,
      instanceId,
    },
  );

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="flex w-1/2 flex-col gap-3">
        <h2 className="mb-6 text-2xl font-semibold">Algorithm Results</h2>
        <Tabs defaultValue="generous">
          <TabsList className="w-full">
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="generous"
            >
              Generous
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="greedy"
            >
              Greedy
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="minimum-cost"
            >
              Minimum Cost
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="greedy-generous"
            >
              Greedy-Generous
            </TabsTrigger>
          </TabsList>
          <Separator className="my-4" />
          <TabsContent value="generous">
            <DetailsTable data={generousData} />
          </TabsContent>
          <TabsContent value="greedy">
            <DetailsTable data={greedyData} />
          </TabsContent>
          <TabsContent value="minimum-cost">
            <DetailsTable data={minCostData} />
          </TabsContent>
          <TabsContent value="greedy-generous">
            <DetailsTable data={greedyGenData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DetailsTable({ data }: { data: ServerResponseData }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center font-semibold">Student</TableHead>
          <TableHead className="text-center font-semibold">Project</TableHead>
          <TableHead className="text-center font-semibold">Rank</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.matching.map((match, i) => (
          <TableRow key={i}>
            <TableCell className="text-center">{match[0]}</TableCell>
            <TableCell className="text-center">{match[1]}</TableCell>
            <TableCell className="text-center">{match[2]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
