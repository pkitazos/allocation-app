"use client";
import { ClassValue } from "clsx";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { StudentRow } from "./allocation-adjustment";

type Student = { id: string; name: string };

export function StudentSelector({
  studentRows,
  setStudentRows,
  className,
}: {
  studentRows: StudentRow[];
  setStudentRows: Dispatch<SetStateAction<StudentRow[]>>;
  className?: ClassValue;
}) {
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const students = studentRows.map(({ student }) => student);

  function updateRows(studentId: string) {
    setSelectedStudent(null);
    const selectedRow = studentRows.find((s) => s.student.id === studentId);
    if (!selectedRow) return;

    setStudentRows((prev) => {
      const alreadySelected = prev
        .map(({ student: { id } }) => id)
        .includes(selectedRow.student.id);
      return alreadySelected ? prev : [...prev, selectedRow];
    });
  }

  function handleStudentSelection(studentId: string) {
    const selectedStudent = students.find((s) => s.id === studentId) || null;
    setSelectedStudent(selectedStudent);
    setOpen(true);
  }

  return (
    <div className={cn("flex items-center gap-5", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[200px] justify-center overflow-hidden pr-1"
          >
            {selectedStudent ? selectedStudent.id : "Select Student"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StudentList
            handleStudentSelection={handleStudentSelection}
            students={students}
          />
        </PopoverContent>
      </Popover>
      <Button
        disabled={!selectedStudent}
        size="icon"
        onClick={() => updateRows(selectedStudent!.id)}
      >
        <Plus className="h-5 w-5 font-bold" />
      </Button>
    </div>
  );
}

function StudentList({
  students,

  handleStudentSelection,
}: {
  students: Student[];
  handleStudentSelection: (studentId: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Search Students..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {students.map((student) => (
            <CommandItem
              className="overflow-hidden text-ellipsis"
              key={student.id}
              value={student.id}
              onSelect={handleStudentSelection}
            >
              {student.id}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
