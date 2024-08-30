"use client";
import { ClassValue } from "clsx";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  DestructiveAction,
  DestructiveActionCancel,
  DestructiveActionConfirm,
  DestructiveActionContent,
  DestructiveActionDescription,
  DestructiveActionFooter,
  DestructiveActionHeader,
  DestructiveActionTitle,
  DestructiveActionTrigger,
  DestructiveActionVerificationTypeIn,
} from "./ui/destructive-action";
import { Label } from "./ui/label";

export function DangerZone({
  spaceLabel,
  name,
  action,
  className,
}: {
  spaceLabel: string;
  name: string;
  action: () => void;
  className?: ClassValue;
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-red-600">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-5">
        <DestructiveAction action={action} requiresVerification>
          <DestructiveActionTrigger>
            <Button variant="destructive" size="lg">
              Delete {spaceLabel}
            </Button>
          </DestructiveActionTrigger>
          <DestructiveActionContent>
            <DestructiveActionHeader>
              <DestructiveActionTitle>
                Are you absolutely sure?
              </DestructiveActionTitle>
              <DestructiveActionDescription>
                This action cannot be undone. This will permanently delete this{" "}
                {spaceLabel} and all related data.
              </DestructiveActionDescription>
            </DestructiveActionHeader>
            <Label>Please type the {spaceLabel} name to confirm: </Label>
            <DestructiveActionVerificationTypeIn phrase={`${name}`} />
            <DestructiveActionFooter>
              <DestructiveActionCancel asChild>
                <Button className="w-28">Cancel</Button>
              </DestructiveActionCancel>
              <DestructiveActionConfirm asChild>
                <Button className="w-28" variant="destructive">
                  Yes, delete
                </Button>
              </DestructiveActionConfirm>
            </DestructiveActionFooter>
          </DestructiveActionContent>
        </DestructiveAction>
        <p>Once you delete an {spaceLabel}, there is no going back.</p>
      </CardContent>
    </Card>
  );
}
