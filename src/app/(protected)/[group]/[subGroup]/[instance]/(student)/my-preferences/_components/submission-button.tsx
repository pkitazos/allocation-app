"use client";
import { PreferenceType } from "@prisma/client";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/lib/trpc/client";

export function SubmissionButton({
  restrictions: { minPreferences, maxPreferences, maxPreferencesPerSupervisor },
  latestSubmissionDateTime,
}: {
  restrictions: {
    minPreferences: number;
    maxPreferences: number;
    maxPreferencesPerSupervisor: number;
  };
  latestSubmissionDateTime: Date | undefined;
}) {
  const params = useInstanceParams();

  const utils = api.useUtils();

  const { data: latestSubmission } = api.user.student.latestSubmission.useQuery(
    { params },
  );

  const refetchLatestSubmission = () =>
    utils.user.student.latestSubmission.refetch();

  const { mutateAsync: submitAsync } =
    api.user.student.preference.submit.useMutation();

  // const isValid =
  //   preferenceList.length >= minPreferences &&
  //   preferenceList.length <= maxPreferences &&
  //   overSelected.length === 0;

  async function handleSubmission() {
    void toast.promise(submitAsync({ params }), {
      loading: "Submitting preference list",
      error: "Something went wrong",
      success: "Submitted preference list",
    });
  }

  const latestSubmissionDate =
    latestSubmission?.toDateString() ??
    latestSubmissionDateTime?.toDateString() ??
    "";

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-medium">
            Submit your preference list
          </CardTitle>
          <Button
            // disabled={!isValid}
            variant="secondary"
            size="lg"
            onClick={handleSubmission}
          >
            {latestSubmissionDateTime ? "Update Submission" : "Submit"}
          </Button>
        </CardHeader>
      </Card>
      <p>Latest submission at: {latestSubmissionDate}</p>
    </>
  );
}
