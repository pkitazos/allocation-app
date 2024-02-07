"use client";
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
import { StudentRow } from "./allocation-adjustment";
import { Plus } from "lucide-react";

type Student = { id: string; name: string };

export function StudentSelectionSearch({
  studentRows,
  setStudentRows,
}: {
  studentRows: StudentRow[];
  setStudentRows: Dispatch<SetStateAction<StudentRow[]>>;
}) {
  const students = studentRows.map(({ student }) => student);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  function updateRows(studentId: string) {
    setSelectedStudent(null);
    const selectedPreference = studentRows.find(
      ({ student }) => student.id === studentId,
    );

    if (!selectedPreference) return;

    setStudentRows((prev) => {
      const alreadySelected = prev
        .map(({ student: { id } }) => id)
        .includes(selectedPreference.student.id);

      return alreadySelected ? prev : [...prev, selectedPreference];
    });
  }

  function handleStudentSelection(studentId: string, students: Student[]) {
    const selectedStudent = students.find((s) => s.id === studentId) || null;
    setSelectedStudent(selectedStudent);
  }

  return (
    <div className="flex items-center gap-5">
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
            setOpen={setOpen}
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
  setOpen,
  handleStudentSelection,
}: {
  students: Student[];
  setOpen: (open: boolean) => void;
  handleStudentSelection: (studentId: string, students: Student[]) => void;
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
              onSelect={(studentId) => {
                handleStudentSelection(studentId, students);
                setOpen(false);
              }}
            >
              {student.id}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
