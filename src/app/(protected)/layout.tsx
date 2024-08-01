import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

// TODO: remove this entire layout as the whole application is protected by shibboleth
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/");

  return <>{children}</>;
}
