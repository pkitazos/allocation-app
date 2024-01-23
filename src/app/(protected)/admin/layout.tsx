import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  // TODO: use adminLevel instead
  if (session && session.user.role !== "ADMIN") {
    return (
      <Unauthorised message="You need to be a super-admin to access this page" />
    );
  }

  return <>{children}</>;
}
