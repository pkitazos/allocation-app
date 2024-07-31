import { api } from "@/lib/trpc/server";

import { spacesLabels } from "@/content/spaces";

import { FormSection } from "./_components/form-section";
import { Heading } from "@/components/heading";

export default async function Page() {
  const takenNames = await api.institution.takenGroupNames();

  return (
    <div className="mb-40 mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <Heading className="text-4xl">
        Create new {spacesLabels.group.full}
      </Heading>
      <FormSection takenNames={takenNames} />
    </div>
  );
}
