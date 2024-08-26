import { PenIcon } from "lucide-react";
import Link from "next/link";

import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { DeleteConfirmation } from "./_components/delete-confirmation";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";
import { spacesLabels } from "@/content/spaces";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([pages.settings.title, displayName, app.name]),
  };
}

export default async function Page({ params }: { params: InstanceParams }) {
  const instance = await api.institution.instance.get({ params });
  return (
    <PanelWrapper className="mt-10 flex flex-col items-start gap-10 px-12">
      <SubHeading className="mb-4">Settings</SubHeading>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-start gap-5">
          <Button size="lg" asChild>
            <Link className="flex items-center gap-2" href="./edit">
              <PenIcon className="h-4 w-4" />
              View or Edit {spacesLabels.instance.short} Details
            </Link>
          </Button>
          <p>Modify {spacesLabels.instance.short}-specific details.</p>
        </CardContent>
      </Card>
      <DeleteConfirmation
        spaceLabel={spacesLabels.instance.short}
        name={instance.displayName}
      />
    </PanelWrapper>
  );
}
