import { Role } from "@prisma/client";

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

  const stage = await api.institution.instance.currentStage.query({ params });

  // TODO: split into separate pages
  return (
    <>
      {/* {stage === Stage.PROJECT_SELECTION && ( */}
      <PreferenceSelection params={params} />
      {/* )} */}
    </>
  );
}
