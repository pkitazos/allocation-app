"use client";
import { SpaceButton } from "@/components/space-button";
import { SpaceContextProvider } from "@/components/space-context";
import { Button } from "@/components/ui/button";
import { AllocationGroup } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";

export function ClientSection({ groups }: { groups: AllocationGroup[] }) {
  return (
    <>
      <Link href="/admin/create">
        <Button
          variant="outline"
          className="h-20 w-40 rounded-lg bg-accent/60 hover:bg-accent"
        >
          <Plus className="h-6 w-6 stroke-[3px]" />
        </Button>
      </Link>
      <SpaceContextProvider>
        <div className="grid w-full grid-cols-3 gap-6">
          {groups.map((group, i) => (
            <SpaceButton
              key={i}
              title={group.displayName}
              index={i}
              url={`/admin/${group.slug}`}
            />
          ))}
        </div>
      </SpaceContextProvider>
    </>
  );
}
