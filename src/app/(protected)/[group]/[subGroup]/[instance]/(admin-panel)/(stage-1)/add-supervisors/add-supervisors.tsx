"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";

import { LabelledSeparator } from "@/components/ui/labelled-separator";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const NewSupervisorSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

type NewSupevisor = z.infer<typeof NewSupervisorSchema>;

export function AddSupervisors() {
  const [, setNewSupervisors] = useState<NewSupevisor[]>([]);

  const { register, handleSubmit, reset } = useForm<NewSupevisor>({
    resolver: zodResolver(NewSupervisorSchema),
  });

  const onSubmit = (data: NewSupevisor) => {
    setNewSupervisors((prev) => [data, ...prev]);
    reset();
  };

  return (
    <div className="flex flex-col px-6">
      <div className="flex flex-col gap-6">
        <h3 className="text-xl">Upload using CSV</h3>
        <div className="flex items-center gap-6">
          <Button variant="outline">add file</Button>
          <p className="text-slate-500">
            (must contain header:{" "}
            <code className="text-slate-600">full_name,email</code>)
          </p>
        </div>
      </div>
      <LabelledSeparator label="or" className="my-6" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-3"
      >
        <h3 className="text-xl">Manually create Supervisor</h3>
        <div className="flex w-full items-center justify-start gap-5">
          <Input className="w-1/3" placeholder="Name" {...register("name")} />
          <Input className="w-2/5" placeholder="Email" {...register("email")} />
          <Button size="icon" variant="secondary">
            <Plus className="h-4 w-4 stroke-white stroke-[3]" />
          </Button>
        </div>
      </form>

      <Separator className="my-14" />
      <div className="flex justify-end">
        <Button>invite</Button>
      </div>
    </div>
  );
}
