"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { useInstanceParams } from "@/components/params-context";
import DataTable from "@/components/ui/data-table/data-table";
import { LabelledSeparator } from "@/components/ui/labelled-separator";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/lib/trpc/client";
import { addSupervisorsCsvHeaders } from "@/lib/validations/add-users/csv";
import { NewSupervisor } from "@/lib/validations/add-users/new-user";
import { adminPanelTabs } from "@/lib/validations/admin-panel-tabs";

import { spacesLabels } from "@/content/spaces";

import { CSVUploadButton } from "./_components/csv-upload-button";
import { FormSection } from "./_components/form-section";
import { constructColumns } from "./_components/new-supervisor-columns";

export default function Page() {
  const router = useRouter();
  const params = useInstanceParams();
  const utils = api.useUtils();

  const { data, isLoading } = api.institution.instance.getSupervisors.useQuery({
    params,
  });

  const refetchData = () => utils.institution.instance.getSupervisors.refetch();

  const { mutateAsync: addSupervisorAsync } =
    api.institution.instance.addSupervisor.useMutation();

  async function handleAddSupervisor(newSupervisor: NewSupervisor) {
    void toast.promise(
      addSupervisorAsync({ params, newSupervisor }).then(() => {
        router.refresh();
        refetchData();
      }),
      {
        loading: "Adding supervisor...",
        success: `Successfully added supervisor ${newSupervisor.institutionId} to ${spacesLabels.instance.short}`,
        error: `Failed to add supervisor to ${spacesLabels.instance.short}`,
      },
    );
  }

  const { mutateAsync: addSupervisorsAsync } =
    api.institution.instance.addSupervisors.useMutation();

  async function handleAddSupervisors(newSupervisors: NewSupervisor[]) {
    void toast.promise(
      addSupervisorsAsync({ params, newSupervisors }).then(() => {
        router.refresh();
        refetchData();
      }),
      {
        loading: "Adding supervisors...",
        success: `Successfully added ${newSupervisors.length} supervisors to ${spacesLabels.instance.short}`,
        error: `Failed to add supervisors to ${spacesLabels.instance.short}`,
      },
    );
  }

  const { mutateAsync: removeSupervisorAsync } =
    api.institution.instance.removeSupervisor.useMutation();

  async function handleSupervisorRemoval(supervisorId: string) {
    void toast.promise(
      removeSupervisorAsync({ params, supervisorId }).then(() => {
        router.refresh();
        refetchData();
      }),
      {
        loading: "Removing supervisor...",
        success: `Successfully removed supervisor ${supervisorId} from ${spacesLabels.instance.short}`,
        error: `Failed to remove supervisor from ${spacesLabels.instance.short}`,
      },
    );
  }

  const { mutateAsync: removeSupervisorsAsync } =
    api.institution.instance.removeSupervisors.useMutation();

  async function handleSupervisorsRemoval(supervisorIds: string[]) {
    void toast.promise(
      removeSupervisorsAsync({ params, supervisorIds }).then(() => {
        router.refresh();
        refetchData();
      }),
      {
        loading: "Removing supervisors...",
        success: `Successfully removed ${supervisorIds.length} supervisors from ${spacesLabels.instance.short}`,
        error: `Failed to remove supervisors from ${spacesLabels.instance.short}`,
      },
    );
  }

  const columns = constructColumns({
    removeSupervisor: handleSupervisorRemoval,
    removeSelectedSupervisors: handleSupervisorsRemoval,
  });

  return (
    <PanelWrapper className="mt-10">
      <SubHeading>{adminPanelTabs.addSupervisors.title}</SubHeading>
      <div className="mt-6 flex flex-col gap-6">
        <h3 className="text-xl">Upload using CSV</h3>
        <div className="flex items-center gap-6">
          <CSVUploadButton
            requiredHeaders={addSupervisorsCsvHeaders}
            handleUpload={handleAddSupervisors}
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
      <FormSection handleAddSupervisor={handleAddSupervisor} />
      <Separator className="my-14" />

      {isLoading ? (
        <Skeleton className="h-20 w-full" />
      ) : (
        <DataTable
          searchableColumn={{
            id: "Full Name",
            displayName: "Supervisor Names",
          }}
          columns={columns}
          data={data ?? []}
        />
      )}
    </PanelWrapper>
  );
}
