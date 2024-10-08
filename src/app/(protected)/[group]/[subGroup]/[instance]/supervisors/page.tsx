import { Heading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { SupervisorsDataTable } from "./_components/all-supervisors-data-table";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([pages.allSupervisors.title, displayName, app.name]),
  };
}

export default async function Page({ params }: { params: InstanceParams }) {
  const role = await api.user.role({ params });
  const data = await api.institution.instance.supervisors({ params });

  return (
    <PageWrapper>
      <Heading>All Supervisors</Heading>
      <SupervisorsDataTable role={role} data={data} />
    </PageWrapper>
  );
}
