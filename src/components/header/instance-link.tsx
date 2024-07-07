import { ReactNode } from "react";
import Link, { LinkProps } from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

type props = LinkProps & { children: ReactNode; className?: ClassValue };

export function InstanceLink({ href, children, className }: props) {
  return (
    <Button className={cn("w-max", className)} variant="ghost" asChild>
      <Link className="text-white" href={href}>
        {children}
      </Link>
    </Button>
  );
}
