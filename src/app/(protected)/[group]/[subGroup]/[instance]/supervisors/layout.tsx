import { ReactNode } from "react";
import { Role } from "@prisma/client";

import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

export default async function Layout({
  params,
  children,
}: {
  params: InstanceParams;
  children: ReactNode;
}) {
  const roles = await api.user.roles({ params });

  if (!roles.has(Role.ADMIN)) {
    return (
      <Unauthorised message="You need to be an admin to access this page" />
    );
  }

  return <>{children}</>;
}
