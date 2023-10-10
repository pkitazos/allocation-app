import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";

import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    return <Unauthorised message="You need to sign in to access this page" />;
  }

  const user = session.user;

  if (user.role !== "SUPERVISOR" && user.role !== "STUDENT") {
    return <Unauthorised message="Your role does not require this page" />;
  }

  return <>{children}</>;
}
