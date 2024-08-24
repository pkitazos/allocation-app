import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { ResultsSection } from "./_components/results-section";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([pages.results.title, displayName, app.name]),
  };
}

export default function Page() {
  return (
    <PanelWrapper className="mt-20 flex flex-col items-center">
      <div className="flex w-full flex-col gap-3">
        <SubHeading className="mb-6 text-2xl">{pages.results.title}</SubHeading>
        <ResultsSection />
      </div>
    </PanelWrapper>
  );
}
