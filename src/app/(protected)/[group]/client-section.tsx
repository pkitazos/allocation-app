"use client";
import { SpaceButton } from "@/components/space-button";
import { SpaceContextProvider } from "@/components/space-context";
import { Button } from "@/components/ui/button";

import { AllocationSubGroup } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ClientSection({
  subGroups,
}: {
  subGroups: AllocationSubGroup[];
}) {
  const pathname = usePathname();
  return (
    <>
      <Link href={`${pathname}/create-sub-group`} className="w-fit">
        <Button
          variant="outline"
          className="h-20 w-40 rounded-lg bg-accent/60 hover:bg-accent"
        >
          <Plus className="h-6 w-6 stroke-[3px]" />
        </Button>
      </Link>
      <SpaceContextProvider>
        <div className="grid grid-cols-3 gap-6">
          {subGroups.map((subGroup, i) => (
            <SpaceButton
              key={i}
              title={subGroup.displayName}
              index={i}
              url={`${pathname}/${subGroup.slug}`}
            />
          ))}
        </div>
      </SpaceContextProvider>
    </>
  );
}
