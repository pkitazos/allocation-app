"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table/data-table";
import { Input } from "@/components/ui/input";
import { LabelledSeparator } from "@/components/ui/labelled-separator";
import { Separator } from "@/components/ui/separator";
import { NewStudent, NewStudentSchema } from "@/lib/validations/csv";

import { CSVUploadButton } from "./csv-upload-button";
import { columns } from "./new-student-columns";

export const csvHeaders = ["full_name", "school_id", "email"];

export function AddStudents() {
  const [newStudents, setNewStudents] = useState<NewStudent[]>([]);

  const { register, handleSubmit, reset } = useForm<NewStudent>({
    resolver: zodResolver(NewStudentSchema),
  });

  const onSubmit = (data: NewStudent) => {
    setNewStudents((prev) => [data, ...prev]);
    reset();
  };

  function handleRowRemoval(idx: number) {
    setNewStudents((prev) => prev.toSpliced(idx, 1));
  }

  return (
    <div className="flex flex-col px-6">
      <div className="flex flex-col gap-6">
        <h3 className="text-xl">Upload using CSV</h3>
        <div className="flex items-center gap-6">
          <CSVUploadButton setNewStudents={setNewStudents} />
          <div className="flex flex-col items-start">
            <p className="text-slate-500">must contain header: </p>
            <code className="text-slate-600">{csvHeaders.join(",")}</code>
          </div>
        </div>
      </div>
      <LabelledSeparator label="or" className="my-6" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-3"
      >
        <h3 className="text-xl">Manually create Student</h3>
        <div className="flex w-full items-center justify-start gap-5">
          <Input
            className="w-1/4"
            placeholder="Full Name"
            {...register("fullName")}
          />
          <Input
            className="w-1/6"
            placeholder="School ID"
            {...register("schoolId")}
          />
          <Input className="w-2/5" placeholder="Email" {...register("email")} />
          <Button size="icon" variant="secondary">
            <Plus className="h-4 w-4 stroke-white stroke-[3]" />
          </Button>
        </div>
      </form>
      <Separator className="my-14" />
      {newStudents.length !== 0 && (
        <DataTable columns={columns(handleRowRemoval)} data={newStudents} />
        // <SimpleTable students={newStudents} setStudents={setNewStudents} />
      )}
      <div className="flex justify-end">
        {/* // TODO: hook up procedure to create invites */}
        <Button disabled={newStudents.length === 0}>invite</Button>
      </div>
    </div>
  );
}
