import { Role } from "@prisma/client";

import { Unauthorised } from "@/components/unauthorised";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";
import { Heading } from "@/components/heading";
import { Card } from "@/components/ui/card";

export default async function Page({ params }: { params: instanceParams }) {
  const role = await api.user.role.query({ params });

  if (role !== Role.SUPERVISOR) {
    return (
      <Unauthorised message="You need to be a Supervisor to access this page" />
    );
  }

  const { projects, targets } = await api.user.supervisor.projects.query({
    params,
  });

  return (
    <div className="flex w-full flex-col gap-2">
      <Heading>My Projects</Heading>
      <Card className="flex justify-between px-10 py-5">
        <h2>targets</h2>
        <p>{targets}</p>
      </Card>
      {projects.map((e) => (
        <p key={e.id}>{e.title}</p>
      ))}
    </div>
  );
}
