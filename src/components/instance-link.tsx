import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

import { Button } from "./ui/button";

type Props = LinkProps & { children: ReactNode };

export function InstanceLink({ href, children }: Props) {
  return (
    <Link className="text-white hover:underline" href={href}>
      <Button variant="ghost">{children}</Button>
    </Link>
  );
}
