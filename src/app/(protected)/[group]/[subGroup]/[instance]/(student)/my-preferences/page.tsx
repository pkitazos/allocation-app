import { Role } from "@prisma/client";

import { Heading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { PreferenceSelection } from "./_components/preference-selection";

export default async function Page({ params }: { params: InstanceParams }) {
  const role = await api.user.role.query({ params });

  if (role !== Role.STUDENT) {
    return (
      <Unauthorised message="You need to be a Student to access this page" />
    );
  }

  return (
    <>
      <Heading>My Preferences</Heading>
      <PanelWrapper className="mt-10 h-full">
        <PreferenceSelection params={params} />
      </PanelWrapper>
    </>
  );
}
