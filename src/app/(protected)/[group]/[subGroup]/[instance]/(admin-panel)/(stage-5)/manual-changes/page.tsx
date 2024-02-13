/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";

import { AllocDetailsProvider } from "./_components/allocation-store";
import { AdjustmentSpace } from "./_components/adjustment-space";

export default async function Page({ params }: { params: instanceParams }) {
  const { students, projects } =
    await api.institution.instance.matching.rowData.query({
      params,
    });

  const { profile, weight } =
    await api.institution.instance.matching.info.query({
      params,
    });

  return (
    <div className="mt-10 flex h-full justify-center px-20">
      <AllocDetailsProvider
        profile={profile}
        weight={weight}
        students={students}
        projects={projects}
        selectedStudentIds={[]}
        conflicts={[]}
      >
        <AdjustmentSpace />
      </AllocDetailsProvider>
    </div>
  );
}
