import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";
import { AllocationAdjustment } from "./adjustment-context";

export default async function Page({ params }: { params: instanceParams }) {
  const allRows = await api.institution.instance.matching.allTheThings.query({
    params,
  });

  const matchingInfo = await api.institution.instance.matching.info.query({
    params,
  });

  return (
    <div className="mt-10 flex h-full justify-center px-20">
      <AllocationAdjustment allRows={allRows} matchingInfo={matchingInfo} />
    </div>
  );
}
