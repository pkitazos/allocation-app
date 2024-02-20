/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { PreferenceType } from "@prisma/client";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/lib/trpc/client";

type PreferenceListRestrictions = {
  minPreferences: number;
  maxPreferences: number;
  maxPreferencesPerSupervisor: number;
};

export function SubmissionButton({
  restrictions: { minPreferences, maxPreferences, maxPreferencesPerSupervisor },
}: {
  restrictions: PreferenceListRestrictions;
}) {
  const params = useInstanceParams();

  const { data, isLoading } =
    api.user.student.preference.initialBoardState.useQuery({ params });

  const preferenceList =
    data?.initialProjects.filter(
      (p) => p.columnId === PreferenceType.PREFERENCE,
    ) ?? [];

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

  const isValid =
    preferenceList.length >= minPreferences &&
    preferenceList.length <= maxPreferences &&
    overSelected.length === 0;

  async function handleSubmission() {
    void toast.promise(async () => {}, {
      loading: "Submitting preference list",
      error: "Something went wrong",
      success: "Submitted preference list",
    });
  }

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-medium">
            Submit your preference list
          </CardTitle>
          <Button
            disabled={!isValid}
            variant="secondary"
            size="lg"
            onClick={handleSubmission}
          >
            Submit
          </Button>
        </CardHeader>
      </Card>
      <div className="flex-col3gap-2 flex">
        {overSelected.map((s) => (
          <Alert
            key={s.id}
            variant={"destructive"}
            className="border-2 bg-destructive/10"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-lg">
              Over-Selected Supervisor
            </AlertTitle>
            <AlertDescription className="text-base">
              Currently have {s.count} projects by Supervisor{" "}
              <span className="font-bold">{s.name}</span> in your preference
              list. The maximum number is {maxPreferencesPerSupervisor}.
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </>
  );
}
