import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ServerResponse } from "@/lib/validations/matching";

export function DetailsTable({ data }: { data: ServerResponse }) {
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
            <TableCell className="text-center">{match.student_id}</TableCell>
            <TableCell className="text-center">
              {match.project_id === "0" ? "-" : match.project_id}
            </TableCell>
            <TableCell className="text-center">
              {match.project_id === "0" ? "-" : match.preference_rank}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
