"use client";
import { Slash } from "lucide-react";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname.length === 1)
    return (
      <ol className="ml-20 flex items-center" aria-label="Breadcrumb">
        <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          Home
          <Slash className="mx-2 h-4 w-4" />
        </li>
      </ol>
    );

  const leafPath = pathname.split("/").slice(1).pop();

  const paths = pathname.split("/").slice(1, -1);

  return (
    <ol className="ml-20 flex items-center" aria-label="Breadcrumb">
      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <a className="hover:text-secondary" href="/">
          Home
        </a>
        <Slash className="mx-2 h-4 w-4" />
      </li>

      {paths.length !== 0 &&
        paths.map((path) => (
          <li
            key={path}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
          >
            <a className="hover:text-secondary" href={`/${path}`}>
              {path}
            </a>
            <Slash className="mx-2 h-4 w-4" />
          </li>
        ))}
      <li
        className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200"
        aria-current="page"
      >
        {leafPath}
      </li>
    </ol>
  );
}
