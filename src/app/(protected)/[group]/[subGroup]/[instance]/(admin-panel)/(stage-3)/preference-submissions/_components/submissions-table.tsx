import { Check, Minus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SubmissionsInfo = {
  userId: string;
  submittedPreferences: boolean;
  submissionCount: number;
};

export function SubmissionsTable({
  preferences,
}: {
  preferences: SubmissionsInfo[];
}) {
  const totalSubmitted = preferences.filter(
    (e) => e.submittedPreferences,
  ).length;
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-accent/50">
          <TableHead className="font-semibold">Student ID</TableHead>
          <TableHead className="text-center">Submitted</TableHead>
          <TableHead className="text-center">Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {preferences.map((c, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{c.userId}</TableCell>
            <TableCell className="flex items-center justify-center">
              {c.submittedPreferences ? (
                <Check className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
            </TableCell>
            <TableCell className="text-center">{c.submissionCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total Submitted</TableCell>
          <TableCell colSpan={1} className="text-center">
            {totalSubmitted}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
