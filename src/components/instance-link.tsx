import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

import { Button } from "./ui/button";

type props = LinkProps & { children: ReactNode };

export function InstanceLink({ href, children }: props) {
  return (
    <Link className="text-white hover:underline" href={href}>
      <Button variant="ghost">{children}</Button>
    </Link>
  );
}
