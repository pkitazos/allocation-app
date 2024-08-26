import { api } from "@/lib/trpc/server";
import { PageParams } from "@/lib/validations/params";

export default async function Page({ params }: { params: PageParams }) {
  const availableProjects = await api.project.getAllForUser({
    params,
    userId: params.id,
  });

  return <></>;
}
