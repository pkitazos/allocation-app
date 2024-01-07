import { Unauthorised } from "@/components/unauthorised";
import { api } from "@/lib/trpc/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { group: string; subGroup: string; instance: string };
}) {
  const access = await api.institution.instance.access.query(params);

  if (!access) {
    return (
      <Unauthorised message="You are not allowed to access the platform at this time" />
    );
  }
  return <>{children}</>;
}
