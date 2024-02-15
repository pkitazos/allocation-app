import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CapacityInfo = {
  userId: string;
  projectAllocationLowerBound: number;
  projectAllocationTarget: number;
  projectAllocationUpperBound: number;
  alreadySubmitted: number;
  submissionTarget: number;
};

export function SubmissionsTable({
  capacities,
}: {
  capacities: CapacityInfo[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Supervisor ID</TableHead>
          <TableHead className="text-center">Already Submitted</TableHead>
          <TableHead className="text-center">Submission Target</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {capacities.map((c, i) => (
          <TableRow key={i}>
            <TableCell>{c.userId}</TableCell>
            <TableCell className="text-center">{c.alreadySubmitted}</TableCell>
            <TableCell className="text-center">{c.submissionTarget}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}
