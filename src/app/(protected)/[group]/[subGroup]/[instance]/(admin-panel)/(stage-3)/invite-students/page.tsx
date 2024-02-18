import { InviteTable } from "@/components/invite-table";
import { Card } from "@/components/ui/card";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { TogglePlatformAccess } from "./_components/toggle-platform-access";

export default async function Page({ params }: { params: InstanceParams }) {
  const { students, platformAccess } =
    await api.institution.instance.invitedStudents.query({
      params,
    });

  return (
    <div className="mx-10 mt-16 flex flex-col items-start gap-4">
      <h1 className="mb-4 text-2xl underline decoration-secondary underline-offset-4">
        Student Instance access
      </h1>
      <Card className="flex w-full items-center justify-between gap-8 px-10 py-5">
        <p>Students can access platform</p>
        <TogglePlatformAccess platformAccess={platformAccess} />
      </Card>

      <h1 className="mb-4 mt-10 text-2xl underline decoration-secondary underline-offset-4">
        Student Invite status
      </h1>
      <InviteTable users={students} />
    </div>
  );
}
