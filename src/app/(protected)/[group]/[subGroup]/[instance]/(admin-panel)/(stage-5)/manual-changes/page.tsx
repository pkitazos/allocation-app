import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";
import { AllocationAdjustment } from "./allocation-adjustment";

export default async function Page({ params }: { params: instanceParams }) {
  const allPreferences =
    await api.institution.instance.matching.preferences.query({ params });

  const allTheThings = await api.institution.instance.matching.allDetails.query(
    { params },
  );

  // TODO: fetch all other necessary data

  /* 
      Stuff I need to know to display useful information

      for each project in a student's preference list
      
      - whether it's been allocated to another student
      - who that sudent is
      - what the project's capacities are
      - how a particular change affects the overall matching details (size, weight, etc.)
    
    */

  return (
    <div className="mt-10 flex h-full justify-center px-20">
      <AllocationAdjustment allRows={allPreferences} />
    </div>
  );
}
