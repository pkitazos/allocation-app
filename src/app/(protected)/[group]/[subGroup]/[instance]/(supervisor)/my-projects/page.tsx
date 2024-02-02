import { Role } from "@prisma/client";

import { Unauthorised } from "@/components/unauthorised";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";

export default async function Page({ params }: { params: instanceParams }) {
  const role = await api.user.role.query({ params });

  if (role === Role.SUPERVISOR) {
    return (
      <Unauthorised message="You need to be a Supervisor to access this page" />
    );
  }
  return <div>this is your projects page page</div>;
}
