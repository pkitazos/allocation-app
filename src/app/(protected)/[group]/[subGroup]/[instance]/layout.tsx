import { Unauthorised } from "@/components/unauthorised";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: instanceParams;
}) {
  const access = await api.institution.instance.access.query({ params });

  if (!access) {
    return (
      <Unauthorised message="You are not allowed to access the platform at this time" />
    );
  }
  return <>{children}</>;
}
