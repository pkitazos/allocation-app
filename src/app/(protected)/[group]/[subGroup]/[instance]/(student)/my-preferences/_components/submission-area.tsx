import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorToaster } from "./submission/error-toaster";
import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

export async function SubmissionArea({ params }: { params: InstanceParams }) {
  const latestSubmissionDateTime = await api.user.student.latestSubmission({
    params,
  });

  const restrictions = await api.user.student.preferenceRestrictions({
    params,
  });

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
            // onClick={handleSubmission}
          >
            {latestSubmissionDateTime ? "Update Submission" : "Submit"}
          </Button>
        </CardHeader>
      </Card>
      <ErrorToaster restrictions={restrictions} />
    </>
  );
}
