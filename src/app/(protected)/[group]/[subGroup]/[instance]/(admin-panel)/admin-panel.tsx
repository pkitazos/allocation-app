import { api } from "@/lib/trpc/server";
import Layout from "./layout";
import { StageControl } from "./stage-control";
import { InstanceParams } from "@/lib/validations/params";

export default async function AdminPanel({
  params,
}: {
  params: InstanceParams;
}) {
  const stage = await api.institution.instance.currentStage.query({ params });

  return (
    <Layout params={params}>
      <StageControl stage={stage} />
    </Layout>
  );
}
