import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import Layout from "./layout";
import { StageControl } from "./stage-control";

export default async function AdminPanel({
  params,
}: {
  params: InstanceParams;
}) {
  const stage = await api.institution.instance.currentStage({ params });

  return (
    <Layout params={params}>
      <StageControl stage={stage} />
    </Layout>
  );
}
