"use client";
import { ClassValue } from "clsx";
import { Plus } from "lucide-react";
import { useState } from "react";

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
import { StudentRow } from "@/lib/validations/allocation-adjustment";

import { useAllocDetails } from "../allocation-store";
import React from "react";

type Student = { id: string; name: string };

export function StudentSelector({
  remainingRows,
  className,
}: {
  remainingRows: StudentRow[];
  className?: ClassValue;
}) {
  const students = remainingRows.map(({ student }) => student);
  const visibleRows = useAllocDetails((s) => s.visibleRows);
  const updateVisibleRows = useAllocDetails((s) => s.updateVisibleRows);

  const rowConflicts = useAllocDetails((s) => s.rowConflicts);
  const updateRowConflicts = useAllocDetails((s) => s.updateRowConflicts);

  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  function updateRows(studentId: string) {
    setSelectedStudent(null);

    const selectedRow = remainingRows.find((s) => s.student.id === studentId);
    if (!selectedRow) return;

    const alreadySelected = visibleRows
      .map(({ student: { id } }) => id)
      .includes(selectedRow.student.id);

    const updatedRows = alreadySelected
      ? visibleRows
      : [...visibleRows, selectedRow];
    updateVisibleRows(updatedRows);

    const updatedRowConflicts = [...rowConflicts, []];
    updateRowConflicts(updatedRowConflicts);
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
