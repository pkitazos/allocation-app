import { Algorithms } from "./(algorithms)/algorithms";

export default function Page({
  params: { group, subGroup, instance },
}: {
  params: { group: string; subGroup: string; instance: string };
}) {
  return (
    <div className="mb-20 w-full max-w-5xl">
      <Algorithms groupId={group} subGroupId={subGroup} instanceId={instance} />
    </div>
  );
}
