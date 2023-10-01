import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session || !session.user) redirect("/api/auth/signin");
  return <>{children}</>;
}
