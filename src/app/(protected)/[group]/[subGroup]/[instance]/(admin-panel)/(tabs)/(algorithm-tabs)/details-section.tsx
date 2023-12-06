import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/trpc/server";

export async function DetailsSection() {
  const generousData = await api.institution.instance.getAlgorithmResult.query({
    algorithmName: "generous",
    algFlag1: "MAXSIZE",
    algFlag2: "GEN",
    algFlag3: "LSB",
  });

  //   const greedyData = await api.institution.instance.getAlgorithmResult.query({
  //     algorithmName: "greedy",
  //     algFlag1: "MAXSIZE",
  //     algFlag2: "GRE",
  //     algFlag3: "LSB",
  //   });
  //   const minCostData = await api.institution.instance.getAlgorithmResult.query({
  //     algorithmName: "minimum-cost",
  //     algFlag1: "MAXSIZE",
  //     algFlag2: "MINCOST",
  //     algFlag3: "LSB",
  //   });
  //   const greedyGenData = await api.institution.instance.getAlgorithmResult.query(
  //     {
  //       algorithmName: "greedy-generous",
  //       algFlag1: "MAXSIZE",
  //       algFlag2: "GRE",
  //       algFlag3: "LSB",
  //     },
  //   );

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
        {generousData.matching.map((projectId) => (
          <TableRow>
            <TableCell>studentId</TableCell>
            <TableCell>{projectId}</TableCell>
            <TableCell>rank</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
