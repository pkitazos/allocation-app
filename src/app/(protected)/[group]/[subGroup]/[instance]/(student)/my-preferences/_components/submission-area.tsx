"use client";
import { PreferenceType } from "@prisma/client";
import { format } from "date-fns";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/lib/trpc/client";
import { getSubmissionErrors } from "@/lib/utils/preferences/get-errors";
import { ProjectPreference } from "@/lib/validations/board";

export function SubmissionArea({
  initialProjects,
  latestSubmissionDateTime,
  restrictions,
}: {
  initialProjects: ProjectPreference[];
  latestSubmissionDateTime: Date | undefined;
  restrictions: {
    minPreferences: number;
    maxPreferences: number;
    maxPreferencesPerSupervisor: number;
  };
}) {
  const params = useInstanceParams();

  const [submissionDate, setSubmissionDate] = useState<Date | undefined>(
    latestSubmissionDateTime,
  );

  const preferenceList = initialProjects.filter(
    (p) => p.columnId === PreferenceType.PREFERENCE,
  );

  const { isOver, isUnder, hasOverSelectedSupervisor, overSelected } =
    getSubmissionErrors(preferenceList, restrictions);

  const { mutateAsync: submitAsync } =
    api.user.student.preference.submit.useMutation();

  async function handleSubmission() {
    void toast.promise(
      submitAsync({ params }).then((date) => setSubmissionDate(date)),
      {
        loading: "Submitting preference list...",
        error: "Something went wrong",
        success: "Submitted preference list",
      },
    );
  }

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-medium">
            Submit your preference list
          </CardTitle>
          <Button
            disabled={isOver || isUnder || hasOverSelectedSupervisor}
            variant="secondary"
            size="lg"
            onClick={handleSubmission}
          >
            {submissionDate ? "Update Submission" : "Submit"}
          </Button>
        </CardHeader>
      </Card>
      {submissionDate && (
        <div className="flex w-full justify-end p-3 ">
          <p className="text-lg ">
            Last submitted at: {format(submissionDate, "dd/MM/yyyy - HH:mm")}
          </p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {isUnder && (
          <Alert variant="destructive" className="border-2 bg-destructive/10">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle className="text-lg">
              Not enough projects selected
            </AlertTitle>
            <AlertDescription className="text-base">
              You need to have at least {restrictions.minPreferences} projects
              in your preference list.
            </AlertDescription>
          </Alert>
        )}
        {isOver && (
          <Alert variant="destructive" className="border-2 bg-destructive/10">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle className="text-lg">
              Too many projects selected
            </AlertTitle>
            <AlertDescription className="text-base">
              You need to have at most {restrictions.maxPreferences} projects in
              your preference list.
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
            <AlertTitle className="text-lg">
              Over-Selected Supervisor
            </AlertTitle>
            <AlertDescription className="text-base">
              Currently have {s.count} projects by Supervisor{" "}
              <span className="font-bold">{s.name}</span> in your preference
              list. The maximum number per supervisor is{" "}
              {restrictions.maxPreferencesPerSupervisor}.
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </>
  );
}
