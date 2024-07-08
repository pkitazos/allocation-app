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
  const role = await api.user.role({ params });

  if (role !== Role.ADMIN) {
    return (
      <Unauthorised message="You need to be an admin to access this page" />
    );
  }

  return <>{children}</>;
}
