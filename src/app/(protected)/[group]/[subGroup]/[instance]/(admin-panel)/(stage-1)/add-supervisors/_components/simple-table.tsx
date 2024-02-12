import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { NewSupervisor } from "./add-supervisors";

export function SimpleTable({
  supervisors,
  setSupervisors,
}: {
  supervisors: NewSupervisor[];
  setSupervisors: Dispatch<SetStateAction<NewSupervisor[]>>;
}) {
  function handleRowRemoval(idx: number) {
    setSupervisors((prev) => prev.toSpliced(idx, 1));
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          <TableHead>School ID</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supervisors.map(({ fullName, schoolId, email }, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{fullName}</TableCell>
            <TableCell>{schoolId}</TableCell>
            <TableCell>{email}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRowRemoval(i)}
              >
                <X className="h-5 w-5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
