import { api } from "@/lib/trpc/server";

import { instanceParams } from "@/lib/validations/params";
import { ClientSection } from "./client-section";

export default async function Page({ params }: { params: instanceParams }) {
  const matchingData =
    await api.institution.instance.matchingData.query(params);

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="flex min-w-[50%] flex-col gap-3">
        <h2 className="mb-6 text-2xl font-semibold">
          Select Algorithms to run
        </h2>
        <ClientSection params={params} matchingData={matchingData} />
      </div>
    </div>
  );
}
