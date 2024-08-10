"use client";
import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { computeOverSelected } from "@/lib/utils/preferences/over-selected";
import { ProjectPreference } from "@/lib/validations/board";

export function ErrorToaster({
  preferenceList,
  restrictions: { minPreferences, maxPreferences, maxPreferencesPerSupervisor },
}: {
  preferenceList: ProjectPreference[];
  restrictions: {
    minPreferences: number;
    maxPreferences: number;
    maxPreferencesPerSupervisor: number;
  };
}) {
  const overSelected = computeOverSelected(
    preferenceList,
    maxPreferencesPerSupervisor,
  );

  return (
    <div className="flex flex-col gap-2">
      {preferenceList.length < minPreferences && (
        <Alert variant="destructive" className="border-2 bg-destructive/10">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="text-lg">
            Not enough projects selected
          </AlertTitle>
          <AlertDescription className="text-base">
            You need to have at least {minPreferences} projects in your
            preference list.
          </AlertDescription>
        </Alert>
      )}
      {preferenceList.length > maxPreferences && (
        <Alert variant="destructive" className="border-2 bg-destructive/10">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="text-lg">
            Too many projects selected
          </AlertTitle>
          <AlertDescription className="text-base">
            You need to have at most {maxPreferences} projects in your
            preference list.
          </AlertDescription>
        </Alert>
      )}
      {overSelected.map((s) => (
        <Alert
          key={s.id}
          variant="destructive"
          className="border-2 bg-destructive/10"
        >
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="text-lg">Over-Selected Supervisor</AlertTitle>
          <AlertDescription className="text-base">
            Currently have {s.count} projects by Supervisor{" "}
            <span className="font-bold">{s.name}</span> in your preference list.
            The maximum number per supervisor is {maxPreferencesPerSupervisor}.
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
