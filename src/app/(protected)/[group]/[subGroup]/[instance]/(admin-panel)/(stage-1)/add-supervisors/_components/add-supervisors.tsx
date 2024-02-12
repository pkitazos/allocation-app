"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LabelledSeparator } from "@/components/ui/labelled-separator";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";

import { CSVUploadButton } from "./csv-upload-button";
import { SimpleTable } from "./simple-table";

const NewSupervisorSchema = z.object({
  fullName: z.string(),
  schoolId: z.string(),
  email: z.string().email(),
  projectTarget: z.number().int(),
  projectUpperQuota: z.number().int(),
});

export type NewSupervisor = z.infer<typeof NewSupervisorSchema>;

export const csvHeaders = [
  "full_name",
  "school_id",
  "email",
  "project_target",
  "project_upper_quota",
];

export function AddSupervisors() {
  const [newSupervisors, setNewSupervisors] = useState<NewSupervisor[]>([]);

  const { register, handleSubmit, reset } = useForm<NewSupervisor>({
    resolver: zodResolver(NewSupervisorSchema),
  });

  const onSubmit = (data: NewSupervisor) => {
    setNewSupervisors((prev) => [data, ...prev]);
    reset();
  };

  return (
    <div className="flex flex-col px-6">
      <div className="flex flex-col gap-6">
        <h3 className="text-xl">Upload using CSV</h3>
        <div className="flex items-center gap-6">
          <CSVUploadButton setNewSupervisors={setNewSupervisors} />
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
        <h3 className="text-xl">Manually create Supervisor</h3>
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
          <Input className="w-1/4" placeholder="Email" {...register("email")} />
          <Input
            className="w-12"
            placeholder="1"
            {...register("projectTarget")}
          />
          <Input
            className="w-12"
            placeholder="2"
            {...register("projectUpperQuota")}
          />

          <Button size="icon" variant="secondary">
            <Plus className="h-4 w-4 stroke-white stroke-[3]" />
          </Button>
        </div>
      </form>
      <Separator className="my-14" />
      {newSupervisors.length !== 0 && (
        <SimpleTable
          supervisors={newSupervisors}
          setSupervisors={setNewSupervisors}
        />
        // <DataTable columns={columns} data={newSupervisors} />
      )}
      <div className="mt-2 flex justify-end">
        {/* // TODO: hook up procedure to create invites */}
        <Button disabled={newSupervisors.length === 0}>invite</Button>
      </div>
    </div>
  );
}
