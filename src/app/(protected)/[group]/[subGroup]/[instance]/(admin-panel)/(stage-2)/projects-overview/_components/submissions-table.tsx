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
          <TableHead>Already Submitted</TableHead>
          <TableHead>Submission Target</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {capacities.map((c, i) => (
          <TableRow key={i}>
            <TableCell>{c.alreadySubmitted}</TableCell>
            <TableCell>{c.submissionTarget}</TableCell>
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
