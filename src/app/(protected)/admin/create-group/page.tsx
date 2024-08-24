import { Metadata } from "next";

import { Heading } from "@/components/heading";

import { api } from "@/lib/trpc/server";

import { FormSection } from "./_components/form-section";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";
import { spacesLabels } from "@/content/spaces";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: metadataTitle([pages.newGroup.title, app.institution.name, app.name]),
};

export default async function Page() {
  const takenGroupNames = await api.institution.takenGroupNames();

  return (
    <div className="mb-40 mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <Heading className="text-4xl">
        Create new {spacesLabels.group.full}
      </Heading>
      <FormSection takenGroupNames={takenGroupNames} />
    </div>
  );
}
