import { SubHeading } from "@/components/heading";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { FormSection } from "./_components/form-section";

import { Button } from "@/components/ui/button";
import { spacesLabels } from "@/content/space-labels";
import Link from "next/link";

export default async function Page({ params }: { params: InstanceParams }) {
  const currentInstance = await api.institution.instance.getEditFormDetails({
    params,
  });

  return (
    <div className="mb-40 mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <SubHeading>Edit {spacesLabels.instance.full} Details</SubHeading>
      <FormSection currentInstanceDetails={currentInstance} params={params}>
        <Button type="button" size="lg" variant="outline" asChild>
          <Link href="./settings">Cancel</Link>
        </Button>
      </FormSection>
    </div>
  );
}
