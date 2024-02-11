import { Unauthorised } from "@/components/unauthorised";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";
import { Stage } from "@prisma/client";

export async function StudentOverview({ params }: { params: instanceParams }) {
  const stage = await api.institution.instance.currentStage.query({ params });

  if (stage === Stage.PROJECT_SELECTION) {
    return (
      <div className="flex flex-col gap-4">
        <div>{stage}</div>
        <p className="text-xl">Complete your preference list by [deadline]</p>
      </div>
    );
  }

  if (stage === Stage.ALLOCATION_ADJUSTMENT) {
    return (
      <div className="flex flex-col gap-4">
        <div>{stage}</div>
        <p className="text-xl">Nothing you can do right now</p>
      </div>
    );
  }

  if (stage === Stage.ALLOCATION_PUBLICATION) {
    return (
      <div className="flex flex-col gap-4">
        <div>{stage}</div>
        <p className="text-xl">Here&apos;s your project</p>
      </div>
    );
  }

  return (
    <Unauthorised message="You are not allowed to access the platform at this time" />
  );
}
