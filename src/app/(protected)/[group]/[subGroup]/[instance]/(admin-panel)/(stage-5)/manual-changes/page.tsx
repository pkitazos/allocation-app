import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";
import { AllocationAdjustment } from "./allocation-adjustment";

export default async function Page({ params }: { params: instanceParams }) {
  const allPreferences =
    await api.institution.instance.matching.preferences.query({ params });

  return (
    <div className="mt-10 flex h-full justify-center px-20">
      <AllocationAdjustment allRows={allPreferences} />
    </div>
  );
}
