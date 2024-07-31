"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment !== "");

  if (segments.length === 0) return <></>;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" prefetch={false}>
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem key={segment}>
              {index < segments.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link
                    href={`/${segments.slice(0, index + 1).join("/")}`}
                    prefetch={false}
                  >
                    {segment}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{segment}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
