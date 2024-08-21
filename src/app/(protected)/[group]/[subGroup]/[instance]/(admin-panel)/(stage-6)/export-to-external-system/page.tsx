import { PanelWrapper } from "@/components/panel-wrapper";

import { InstanceParams } from "@/lib/validations/params";

export default async function Page({ params }: { params: InstanceParams }) {
  console.log(params);
  return (
    <PanelWrapper className="flex flex-col items-center justify-center gap-5 pt-8">
      Coming Soon
      {/* 
      // TODO: add to NoteCard after merging branches 
      <p>Include note card here explaining the steps/what will happen?</p>
     
      <SubHeading className="mt-3">
        Check users exist on Assessment System
      </SubHeading>
      <SubHeading className="mt-16">
        Create Projects on Assessment System
      </SubHeading>
      <CreateProjectsSection /> */}
    </PanelWrapper>
  );
}
