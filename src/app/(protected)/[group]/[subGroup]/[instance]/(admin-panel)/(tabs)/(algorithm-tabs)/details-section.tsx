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

export async function DetailsSection() {
  const generousData = await api.institution.instance.getAlgorithmResult.query({
    algorithmName: "generous",
    algFlag1: "MAXSIZE",
    algFlag2: "GEN",
    algFlag3: "LSB",
  });

  const greedyData = await api.institution.instance.getAlgorithmResult.query({
    algorithmName: "greedy",
    algFlag1: "MAXSIZE",
    algFlag2: "GRE",
    algFlag3: "LSB",
  });

  const minCostData = await api.institution.instance.getAlgorithmResult.query({
    algorithmName: "minimum-cost",
    algFlag1: "MAXSIZE",
    algFlag2: "MINCOST",
    algFlag3: "LSB",
  });

  const greedyGenData = await api.institution.instance.getAlgorithmResult.query(
    {
      algorithmName: "greedy-generous",
      algFlag1: "MAXSIZE",
      algFlag2: "GRE",
      algFlag3: "LSB",
    },
  );

  return (
    <>
      <Tabs defaultValue="generous">
        <TabsList>
          <TabsTrigger value="generous">Generous</TabsTrigger>
          <TabsTrigger value="greedy">Greedy</TabsTrigger>
          <TabsTrigger value="minimum-cost">Minimum Cost</TabsTrigger>
          <TabsTrigger value="greedy-generous">GreedyGenerous</TabsTrigger>
        </TabsList>
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
    </>
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
