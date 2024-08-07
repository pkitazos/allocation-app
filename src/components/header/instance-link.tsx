import { ReactNode } from "react";
import { ClassValue } from "clsx";
import Link, { LinkProps } from "next/link";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

type props = LinkProps & { children: ReactNode; className?: ClassValue };

export function InstanceLink({ href, children, className }: props) {
  return (
    <Button variant="ghost" asChild>
      <Link className={cn("w-max text-white", className)} href={href}>
        {children}
      </Link>
    </Button>
  );
}
