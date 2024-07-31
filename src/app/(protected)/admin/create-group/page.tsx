import { api } from "@/lib/trpc/server";

import { FormSection } from "./_components/form-section";

import { spacesLabels } from "@/content/spaces";

export default async function Page() {
  const takenGroupNames = await api.institution.takenGroupNames();
  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h2 className="text-4xl">
        Create New{" "}
        <span className="font-semibold text-sky-500">
          {spacesLabels.group.full}
        </span>
      </h2>
      <FormSection takenGroupNames={takenGroupNames} />
    </div>
  );
}
