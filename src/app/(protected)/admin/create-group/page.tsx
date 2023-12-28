import { api } from "@/lib/trpc/server";
import { FormSection } from "./form-section";

export default async function Page() {
  const takenNames = await api.institution.getAllGroupNames.query();
  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h2 className="text-4xl">
        Create New{" "}
        <span className="font-semibold text-sky-500">Allocation Group</span>
      </h2>
      <FormSection takenNames={takenNames} />
    </div>
  );
}
