import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (
    session &&
    session.user.role !== "SUPER_ADMIN" &&
    session.user.role !== "GROUP_ADMIN" &&
    session.user.role !== "SUB_GROUP_ADMIN" &&
    session.user.role !== "SUPERVISOR"
  ) {
    return (
      <Unauthorised message="You need to be an admin to access this page" />
    );
  }

  return <>{children}</>;
}
