"use client";
import { cn } from "@/lib/utils";

import { useSpaceContext } from "./space-context";
import Link from "next/link";
import { AnchorHTMLAttributes } from "react";
import { Card } from "./ui/card";

export function SpaceButton({
  title,
  index,
  url,
  className,
}: {
  title: string;
  index: number;
  url: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { selectedIndex, update } = useSpaceContext();
  return (
    <Card
      className={cn(
        "relative col-span-1 h-20 rounded-lg",
        index === selectedIndex &&
          "outline outline-[5px] outline-sky-600 transition-colors duration-200 hover:bg-accent",
        className,
      )}
    >
      <Link
        className={cn(
          "absolute left-0 top-0 z-20 h-full w-full px-5",
          index === selectedIndex ? "block" : "hidden",
        )}
        href={`${url}`}
      >
        &nbsp;
      </Link>
      <button
        className="z-10 block h-full w-full rounded-md px-5 font-semibold transition-colors duration-200"
        onClick={() => update(index)}
      >
        {title}
      </button>
    </Card>
  );
}
