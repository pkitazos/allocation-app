import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Minus } from "lucide-react";

type SubmissionsInfo = {
  userId: string;
  alreadySubmitted: boolean;
  submissionCount: number;
};

export function SubmissionsTable({
  preferences,
}: {
  preferences: SubmissionsInfo[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Student ID</TableHead>
          <TableHead className="text-center">Submitted</TableHead>
          <TableHead className="text-center">Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {preferences.map((c, i) => (
          <TableRow key={i}>
            <TableCell>{c.userId}</TableCell>
            <TableCell className="flex items-center justify-center">
              {c.alreadySubmitted ? (
                <Check className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
            </TableCell>
            <TableCell className="text-center">{c.submissionCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
