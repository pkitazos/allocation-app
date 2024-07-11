import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SupervisorProjectSubmissionDetails } from "@/lib/validations/supervisor-project-submission-details";

export function SubmissionsTable({
  capacities,
}: {
  capacities: SupervisorProjectSubmissionDetails[];
}) {
  const totalReached = capacities.reduce(
    (acc, val) =>
      val.submittedProjectsCount >= val.submissionTarget ? acc + 1 : acc,
    0,
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-accent/50">
          <TableHead className="font-semibold">Supervisor ID</TableHead>
          <TableHead className="text-center">Already Submitted</TableHead>
          <TableHead className="text-center">Submission Target</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {capacities.map((c, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{c.userId}</TableCell>
            <TableCell className="text-center">
              {c.submittedProjectsCount}
            </TableCell>
            <TableCell className="text-center">
              {c.submissionTarget < 0 && 0}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Reached Target</TableCell>
          <TableCell colSpan={1} className="text-center">
            {totalReached}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
