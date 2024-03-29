import { ReactNode } from "react";
import Link, { LinkProps } from "next/link";

import { Button } from "@/components/ui/button";

type props = LinkProps & { children: ReactNode };

export function InstanceLink({ href, children }: props) {
  return (
    <Link className="text-white hover:underline" href={href}>
      <Button variant="ghost">{children}</Button>
    </Link>
  );
}
