import { Unauthorised } from "@/components/unauthorised";
import { api } from "@/lib/trpc/server";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const access = await api.institution.superAdminAccess.query();

  if (!access) {
    return (
      <Unauthorised message="You need to be a super-admin to access this page" />
    );
  }

  return <>{children}</>;
}
