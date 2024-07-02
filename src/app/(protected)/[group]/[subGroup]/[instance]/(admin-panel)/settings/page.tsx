import { PenIcon } from "lucide-react";
import Link from "next/link";

import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DangerZone } from "./_components/danger-zone";
import { spacesLabels } from "@/content/space-labels";

export default async function Page() {
  return (
    <PanelWrapper className="gap-10 pt-16">
      <SubHeading>Settings</SubHeading>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-start gap-5">
          <Button className="flex items-center gap-2" size="lg">
            <PenIcon className="h-4 w-4" />
            <Link href="./edit">
              View or Edit {spacesLabels.instance.short} Details
            </Link>
          </Button>
          <p>Modify {spacesLabels.instance.short}-specific details.</p>
        </CardContent>
      </Card>
      <DangerZone spaceTitle={spacesLabels.instance.short} />
    </PanelWrapper>
  );
}
