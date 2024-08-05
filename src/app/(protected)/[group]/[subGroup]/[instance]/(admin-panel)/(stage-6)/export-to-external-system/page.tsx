import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { InstanceParams } from "@/lib/validations/params";

import { CreateProjectsSection } from "./_components/send-allocations";

export default async function Page({ params }: { params: InstanceParams }) {
  return (
    <PanelWrapper className="flex flex-col gap-5 pt-8">
      {/* // TODO: add to NoteCard after merging branches 
      <p>Include note card here explaining the steps/what will happen?</p>
      */}
      <SubHeading className="mt-3">
        Check users exist on Assessment System
      </SubHeading>
      <SubHeading className="mt-16">
        Create Projects on Assessment System
      </SubHeading>
      <CreateProjectsSection />
    </PanelWrapper>
  );
}
