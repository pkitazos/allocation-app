import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";

import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    return <Unauthorised message="You need to sign in to access this page" />;
  }

  return <>{children}</>;
}
