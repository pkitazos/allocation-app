import { FilePlus2, PenIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Heading, SubHeading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";
import { buttonVariants } from "@/components/ui/button";

import { api } from "@/lib/trpc/server";
import { cn } from "@/lib/utils";
import { InstanceParams } from "@/lib/validations/params";

import { SupervisorProjectsDataTable } from "./_components/supervisor-projects-data-table";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

type PageParams = InstanceParams & { id: string };

export async function generateMetadata({ params }: { params: PageParams }) {
  const { displayName } = await api.institution.instance.get({ params });
  const { name } = await api.user.getById({ userId: params.id });

  return {
    title: metadataTitle([
      name,
      pages.allSupervisors.title,
      displayName,
      app.name,
    ]),
  };
}

export default async function Page({ params }: { params: PageParams }) {
  const supervisorId = params.id;
  const exists = await api.user.supervisor.exists({
    params,
    supervisorId,
  });
  if (!exists) notFound();

  const { supervisor, projects } = await api.user.supervisor.instanceData({
    params,
    supervisorId,
  });

  return (
    <PageWrapper>
      <Heading
        className={cn(
          "flex items-center justify-between gap-2",
          supervisor.name.length > 30 && "text-3xl",
        )}
      >
        <p>{supervisor.name}</p>
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex items-center justify-center gap-2 text-nowrap",
          )}
          href={`../supervisors/${supervisorId}/edit`}
        >
          <PenIcon className="h-4 w-4" />
          <p>Edit details</p>
        </Link>
      </Heading>
      <SubHeading>Details</SubHeading>
      <div className="flex flex-col">
        <div className="flex gap-2">
          <span className="w-16 font-semibold text-slate-500">ID:</span>
          <p className="col-span-9">{supervisorId}</p>
        </div>
        <div className="flex gap-2">
          <span className="w-16 font-semibold text-slate-500">Email:</span>
          <p className="col-span-9">{supervisor.email}</p>
        </div>
      </div>
      <div className="-mb-2 mt-6 flex items-center justify-between">
        <SubHeading>All Projects</SubHeading>
        <Link
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "flex items-center justify-center gap-2 text-nowrap",
          )}
          href={`../supervisors/${supervisorId}/new-project`}
        >
          <FilePlus2 className="h-4 w-4" />
          <p>New Project</p>
        </Link>
      </div>
      <SupervisorProjectsDataTable data={projects} />
    </PageWrapper>
  );
}
