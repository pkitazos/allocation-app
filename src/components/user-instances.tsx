import { api } from "@/lib/trpc/server";
import Link from "next/link";
import { Button } from "./ui/button";

export async function UserInstances() {
  const instances = await api.user.instances.query();

  return (
    <div className="h-40">
      <h2 className="mb-10 text-xl font-semibold underline decoration-secondary decoration-4">
        Your instances
      </h2>
      {instances.map(({ group, subGroup, instance }, i) => (
        <Link href={`/${group.id}/${subGroup.id}/${instance.id}`} key={i}>
          <Button
            className="flex h-max flex-col items-start gap-1 py-4"
            variant="outline"
            size="lg"
          >
            <p className="text-lg">{group.displayName}</p>
            <p>{subGroup.displayName}</p>
            <p>{instance.displayName}</p>
          </Button>
        </Link>
      ))}
    </div>
  );
}
