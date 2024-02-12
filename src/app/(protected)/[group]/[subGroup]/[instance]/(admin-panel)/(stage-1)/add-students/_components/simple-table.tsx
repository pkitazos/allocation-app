import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { NewStudent } from "./add-students";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function SimpleTable({
  students,
  setStudents,
}: {
  students: NewStudent[];
  setStudents: Dispatch<SetStateAction<NewStudent[]>>;
}) {
  function handleRowRemoval(idx: number) {
    setStudents((prev) => prev.toSpliced(idx, 1));
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
        {students.map(({ fullName, schoolId, email }, i) => (
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
