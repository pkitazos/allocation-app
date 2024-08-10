"use client";
import { PreferenceType } from "@prisma/client";
import { AlertCircleIcon } from "lucide-react";

import { useInstanceParams } from "@/components/params-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { api } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";

export function ErrorToaster({
  restrictions: { minPreferences, maxPreferences, maxPreferencesPerSupervisor },
}: {
  restrictions: {
    minPreferences: number;
    maxPreferences: number;
    maxPreferencesPerSupervisor: number;
  };
}) {
  const params = useInstanceParams();

  const { status, data } =
    api.user.student.preference.initialBoardState.useQuery({
      params,
    });

  if (status !== "success") return;

  const preferenceList = data.initialProjects.filter(
    (p) => p.columnId === PreferenceType.PREFERENCE,
  );

  const supervisorCounts = preferenceList.reduce(
    (acc, { supervisorId }) =>
      acc.set(supervisorId, (acc.get(supervisorId) || 0) + 1),
    new Map<string, number>(),
  );

  const supervisorNames = preferenceList.reduce(
    (acc, { supervisorId, supervisorName }) => ({
      ...acc,
      [supervisorId]: supervisorName,
    }),
    {} as { [key: string]: string },
  );

  const overSelected = Array.from(supervisorCounts.entries())
    .map(([s, n]) => ({
      id: s,
      name: supervisorNames[s],
      count: n,
    }))
    .filter(({ count }) => count > maxPreferencesPerSupervisor);

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
