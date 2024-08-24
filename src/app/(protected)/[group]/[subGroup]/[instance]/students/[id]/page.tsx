import { notFound } from "next/navigation";

import { Heading, SubHeading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";
import { StudentSavedPreferenceDataTable } from "@/components/student-saved-preferences/data-table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { StudentPreferenceDataTable } from "./_components/student-preference-data-table";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

type PageParams = InstanceParams & { id: string };

export async function generateMetadata({ params }: { params: PageParams }) {
  const { displayName } = await api.institution.instance.get({ params });
  const { name } = await api.user.getById({ userId: params.id });

  return {
    title: metadataTitle([
      name,
      pages.allStudents.title,
      displayName,
      app.name,
    ]),
  };
}

export default async function Page({ params }: { params: PageParams }) {
  const studentId = params.id;
  const exists = await api.user.student.exists({
    params,
    studentId,
  });
  if (!exists) notFound();

  const student = await api.user.student.getById({
    params,
    studentId,
  });

  const currentBoardState = await api.user.student.preference.getAll({
    params,
    studentId,
  });

  const lastSubmission = await api.user.student.preference.getAllSaved({
    params,
    studentId,
  });

  return (
    <PageWrapper>
      <Heading>{student.name}</Heading>
      <SubHeading>Details</SubHeading>
      <div className="flex flex-col">
        <div className="flex gap-2">
          <span className="w-16 font-semibold text-slate-500">ID:</span>
          <p className="col-span-9">{studentId}</p>
        </div>
        <div className="flex gap-2">
          <span className="w-16 font-semibold text-slate-500">Email:</span>
          <p className="col-span-9">{student.email}</p>
        </div>
        <div className="flex gap-2">
          <span className="w-16 font-semibold text-slate-500">Level:</span>
          <p className="col-span-9">{student.level}</p>
        </div>
      </div>
      <SubHeading>Preferences</SubHeading>
      <Tabs defaultValue="current-board-state" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger
            className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            value="current-board-state"
          >
            Current Board State
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            value="last-submission"
          >
            Last Submission
          </TabsTrigger>
        </TabsList>
        <Separator className="my-4" />
        <TabsContent value="current-board-state">
          <StudentPreferenceDataTable
            data={currentBoardState}
            studentId={studentId}
          />
        </TabsContent>
        <TabsContent value="last-submission">
          <StudentSavedPreferenceDataTable data={lastSubmission} />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
