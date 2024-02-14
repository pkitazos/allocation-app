import { Role, Stage } from "@prisma/client";

import { Unauthorised } from "@/components/unauthorised";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";

import { AllocatedProject } from "./_components/allocated-project";
import { PreferenceSelection } from "./_components/preference-selection";

export default async function Page({ params }: { params: instanceParams }) {
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
      {stage === Stage.ALLOCATION_PUBLICATION && (
        <AllocatedProject params={params} />
      )}
    </>
  );
}
