import Link from "next/link";

import { api } from "@/lib/trpc/server";

import { Button } from "./ui/button";

export async function UserInstances() {
  const instances = await api.user.instances();

  return (
    <div className="h-40 mb-3">
      <h2 className="mb-10 text-xl font-semibold underline decoration-secondary decoration-4">
        Your instances
      </h2>
      <div className="flex w-full gap-3 overflow-x-scroll pb-3">
        {instances.map(({ group, subGroup, instance }, i) => (
          <Link href={`/${group.id}/${subGroup.id}/${instance.id}`} key={i}>
            <Button
              className="flex h-max w-full min-w-60 flex-col items-start gap-1 px-5 py-4"
              variant="outline"
              size="lg"
            >
              <span className="w-full translate-y-1.5 text-left text-xs text-muted-foreground">
                Instance
              </span>
              <p className="text-left text-base font-bold">
                {instance.displayName}
              </p>

              <span className="w-full translate-y-1.5 text-left text-xs text-muted-foreground">
                Sub-Group
              </span>
              <p className="text-left">{subGroup.displayName}</p>

              <span className="w-full translate-y-1.5 text-left text-xs text-muted-foreground">
                Group
              </span>
              <p className="text-left">{group.displayName}</p>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
