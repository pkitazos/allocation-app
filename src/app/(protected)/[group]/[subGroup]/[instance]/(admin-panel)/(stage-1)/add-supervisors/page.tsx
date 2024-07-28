"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { useInstanceParams } from "@/components/params-context";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table/data-table";
import { Input } from "@/components/ui/input";
import { LabelledSeparator } from "@/components/ui/labelled-separator";
import { Separator } from "@/components/ui/separator";

import { api } from "@/lib/trpc/client";
import {
  addSupervisorsCsvHeaders,
  addSupervisorsCsvRowSchema,
} from "@/lib/validations/add-users/csv";
import { NewSupervisor } from "@/lib/validations/add-users/new-user";
import { adminPanelTabs } from "@/lib/validations/admin-panel-tabs";

import { CSVUploadButton } from "./_components/csv-upload-button";
import { columns } from "./_components/new-supervisor-columns";

export default function Page() {
  const router = useRouter();
  const params = useInstanceParams();

  const [newSupervisors, setNewSupervisors] = useState<NewSupervisor[]>([]);

  const { register, handleSubmit, reset } = useForm<NewSupervisor>({
    resolver: zodResolver(addSupervisorsCsvRowSchema),
  });

  function onSubmit(data: NewSupervisor) {
    setNewSupervisors((prev) => [data, ...prev]);
    reset();
  }

  function handleRowRemoval(idx: number) {
    setNewSupervisors((prev) => prev.toSpliced(idx, 1));
  }

  const { mutateAsync } =
    api.institution.instance.addSupervisorDetails.useMutation();

  async function handleAddSupervisorDetails() {
    void toast.promise(
      mutateAsync({
        params,
        newSupervisors,
      }).then(() => {
        setNewSupervisors([]);
        router.refresh();
      }),
      {
        loading: "Adding Supervisors...",
        error: "Something went wrong",
        success: "Success",
      },
    );
  }

  return (
    <PanelWrapper className="mt-10">
      <SubHeading>{adminPanelTabs.addSupervisors.title}</SubHeading>
      <div className="mt-6 flex flex-col gap-6">
        <h3 className="text-xl">Upload using CSV</h3>
        <div className="flex items-center gap-6">
          <CSVUploadButton
            requiredHeaders={addSupervisorsCsvHeaders}
            setNewSupervisors={setNewSupervisors}
          />
          <div className="flex flex-col items-start">
            <p className="text-muted-foreground">must contain header: </p>
            <code className="text-muted-foreground">
              {addSupervisorsCsvHeaders.join(",")}
            </code>
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
            placeholder="GUID"
            {...register("institutionId")}
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

      <DataTable
        searchableColumn={{ id: "full Name", displayName: "Supervisor Names" }}
        columns={columns(handleRowRemoval, () => setNewSupervisors([]))}
        data={newSupervisors}
      />

      <div className="mt-2 flex justify-end">
        <Button
          onClick={handleAddSupervisorDetails}
          disabled={newSupervisors.length === 0}
        >
          invite
        </Button>
      </div>
    </PanelWrapper>
  );
}
