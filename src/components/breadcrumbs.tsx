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

import { api } from "@/lib/trpc/client";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment !== "");

  const { status, data } = api.user.breadcrumbs.useQuery({ segments });

  if (segments.length === 0) return <></>;

  if (status !== "success") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/"
                prefetch={false}
                className="hover:text-secondary hover:underline"
              >
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((segment) => (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem key={segment}>
                <BreadcrumbPage className="text-muted-foreground">
                  {segment}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/"
              prefetch={false}
              className="hover:text-secondary hover:underline"
            >
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {data.map(({ segment, access }, index) => (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem key={segment}>
              {index < segments.length - 1 && access ? (
                <BreadcrumbLink asChild>
                  <Link
                    href={`/${segments.slice(0, index + 1).join("/")}`}
                    className="hover:text-secondary hover:underline"
                    prefetch={false}
                  >
                    {segment}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-muted-foreground">
                  {segment}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
