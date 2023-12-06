"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Stage } from "@prisma/client";

type SidebarProps = {
  stage: Stage;
} & React.HTMLAttributes<HTMLDivElement>;

const tabsRecord: Record<Stage, string[]> = {
  SETUP: ["add Supervisors", "add Students"],
  PROJECT_SUBMISSION: ["invite Supervisors", "projects overview"],
  PROJECT_SELECTION: ["invite Students", "preferences overview"],
  PROJECT_ALLOCATION: ["algorithms overview", "allocation details"],
  ALLOCATION_PUBLICATION: ["allocation overview"],
};

export function Sidebar({ stage, className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="flex flex-col gap-3 px-3">
          <Button variant="outline" className="bg-accent/50">
            Stage Control
          </Button>
          <Separator className="h-[2px]" />
          <>
            {tabsRecord[stage].map((tab, i) => (
              <Button key={i} variant="outline" className="w-full">
                {tab}
              </Button>
            ))}
          </>
        </div>
      </div>
    </div>
  );
}
