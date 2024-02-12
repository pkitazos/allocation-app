import { Card } from "@/components/ui/card";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";

import { TogglePlatformAccess } from "./_components/toggle-platform-access";
import { InviteTable } from "@/components/invite-table";

export default async function Page({ params }: { params: instanceParams }) {
  const { supervisors, platformAccess } =
    await api.institution.instance.invitedSupervisors.query({
      params,
    });

  return (
    <div className="mx-10 mt-16 flex flex-col items-start gap-4">
      <h1 className="mb-4 text-2xl underline decoration-secondary underline-offset-4">
        Supervisor Instance access
      </h1>
      <Card className="flex w-full items-center justify-between gap-8 px-10 py-5">
        <p>Supervisors can access platform</p>
        <TogglePlatformAccess params={params} platformAccess={platformAccess} />
      </Card>

      <h1 className="mb-4 mt-10 text-2xl underline decoration-secondary underline-offset-4">
        Supervisor Invite status
      </h1>
      <InviteTable users={supervisors} />
    </div>
  );
}
