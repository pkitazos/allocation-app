import { Role } from "@prisma/client";
import { ReactNode } from "react";

import { Unauthorised } from "@/components/unauthorised";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";

export default async function Layout({
  params,
  children,
}: {
  params: instanceParams;
  children: ReactNode;
}) {
  const role = await api.user.role.query({ params });

  // TODO: decide if supervisors should have access to this page
  if (role !== Role.ADMIN && role !== Role.SUPERVISOR) {
    return (
      <Unauthorised message="You need to be an admin to access this page" />
    );
  }

  return <>{children}</>;
}
