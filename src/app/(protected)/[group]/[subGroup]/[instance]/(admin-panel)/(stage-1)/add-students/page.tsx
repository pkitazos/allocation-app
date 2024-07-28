"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/lib/trpc/client";
import { addStudentsCsvHeaders } from "@/lib/validations/add-users/csv";
import {
  NewStudent,
  newStudentSchema,
} from "@/lib/validations/add-users/new-user";
import { adminPanelTabs } from "@/lib/validations/admin-panel-tabs";

import { spacesLabels } from "@/content/spaces";

import { CSVUploadButton } from "./_components/csv-upload-button";
import { constructColumns } from "./_components/new-student-columns";

export default function Page() {
  const router = useRouter();
  const params = useInstanceParams();
  const utils = api.useUtils();

  const { data, isLoading } = api.institution.instance.getStudents.useQuery({
    params,
  });

  const refetchData = () => utils.institution.instance.getStudents.refetch();

  const { register, handleSubmit, reset } = useForm<NewStudent>({
    resolver: zodResolver(newStudentSchema),
  });

  const { mutateAsync: addStudentAsync } =
    api.institution.instance.addStudent.useMutation();

  async function handleAddStudent(newStudent: NewStudent) {
    void toast.promise(
      addStudentAsync({ params, newStudent }).then(() => {
        router.refresh();
        refetchData();
      }),
      {
        loading: "Adding student...",
        success: `Successfully added student ${newStudent.institutionId} to ${spacesLabels.instance.short}`,
        error: `Failed to add student to ${spacesLabels.instance.short}`,
      },
    );
  }

  const { mutateAsync: addStudentsAsync } =
    api.institution.instance.addStudents.useMutation();

  async function handleAddStudents(newStudents: NewStudent[]) {
    void toast.promise(
      addStudentsAsync({ params, newStudents }).then(() => {
        router.refresh();
        refetchData();
      }),
      {
        loading: "Adding students...",
        success: `Successfully added ${newStudents.length} students to ${spacesLabels.instance.short}`,
        error: `Failed to add students to ${spacesLabels.instance.short}`,
      },
    );
  }

  const { mutateAsync: removeStudentAsync } =
    api.institution.instance.removeStudent.useMutation();

  async function handleStudentRemoval(studentId: string) {
    void toast.promise(
      removeStudentAsync({ params, studentId }).then(() => {
        router.refresh();
        refetchData();
      }),
      {
        loading: "Removing student...",
        success: `Successfully removed student ${studentId} from ${spacesLabels.instance.short}`,
        error: `Failed to remove student from ${spacesLabels.instance.short}`,
      },
    );
  }

  const { mutateAsync: removeStudentsAsync } =
    api.institution.instance.removeStudents.useMutation();

  async function handleStudentsRemoval(studentIds: string[]) {
    void toast.promise(
      removeStudentsAsync({ params, studentIds }).then(() => {
        router.refresh();
        refetchData();
      }),
      {
        loading: "Removing students...",
        success: `Successfully removed ${studentIds.length} students from ${spacesLabels.instance.short}`,
        error: `Failed to remove students from ${spacesLabels.instance.short}`,
      },
    );
  }

  function onSubmit(data: NewStudent) {
    handleAddStudent(data);
    reset();
  }

  const columns = constructColumns({
    removeStudent: handleStudentRemoval,
    removeSelectedStudents: handleStudentsRemoval,
  });

  return (
    <PanelWrapper className="mt-10">
      <SubHeading>{adminPanelTabs.addStudents.title}</SubHeading>
      <div className="mt-6 flex flex-col gap-6">
        <h3 className="text-xl">Upload using CSV</h3>
        <div className="flex items-center gap-6">
          <CSVUploadButton
            requiredHeaders={addStudentsCsvHeaders}
            handleUpload={handleAddStudents}
          />
          <div className="flex flex-col items-start">
            <p className="text-muted-foreground">must contain header: </p>
            <code className="text-muted-foreground">
              {addStudentsCsvHeaders.join(",")}
            </code>
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
            placeholder="Matriculation No."
            {...register("institutionId")}
          />
          <Input className="w-2/5" placeholder="Email" {...register("email")} />
          <Input
            className="w-1/6"
            placeholder="Student Level"
            {...register("level")}
          />
          <Button type="submit" size="icon" variant="secondary">
            <Plus className="h-4 w-4 stroke-white stroke-[3]" />
          </Button>
        </div>
      </form>
      <Separator className="my-14" />
      {isLoading ? (
        <Skeleton className="h-20 w-full" />
      ) : (
        <DataTable
          searchableColumn={{ id: "full Name", displayName: "Student Names" }}
          columns={columns}
          data={data ?? []}
        />
      )}
    </PanelWrapper>
  );
}
