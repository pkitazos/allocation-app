import { api } from "@/lib/trpc/server";
import Layout from "./layout";
import { StageControl } from "./stage-control";
import { instanceParams } from "@/lib/validations/params";

export default async function AdminPanel({
  params,
}: {
  params: instanceParams;
}) {
  const stage = await api.institution.instance.currentStage.query({ params });

  return (
    <Layout params={params}>
      <StageControl stage={stage} />
    </Layout>
  );
}
