import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { instanceParams } from "@/lib/validations/params";

import { PreferenceSelection } from "./preference-selection";
import { AllocatedProject } from "./allocated-project";
import { api } from "@/lib/trpc/server";
import { Stage } from "@prisma/client";

export default async function Page({ params }: { params: instanceParams }) {
  const session = await auth();

  if (session && session.user.role !== "STUDENT") {
    return (
      <Unauthorised message="You need to be a Student to access this page" />
    );
  }

  const stage = await api.institution.instance.currentStage.query({ params });

  return (
    <>
      {stage === Stage.PROJECT_SELECTION && (
        <PreferenceSelection params={params} />
      )}
      {stage === Stage.ALLOCATION_PUBLICATION && (
        <AllocatedProject params={params} />
      )}
    </>
  );
}
