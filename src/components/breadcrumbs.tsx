"use client";
import { Slash } from "lucide-react";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname.length === 1)
    return (
      <ol className="-mt-10 flex ml-20 items-center" aria-label="Breadcrumb">
        <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          Home
          <Slash className="w-4 h-4 mx-2" />
        </li>
      </ol>
    );

  const leafPath = pathname.split("/").slice(1).pop();

  const paths = pathname.split("/").slice(1, -1);

  return (
    <ol className="-mt-10 ml-20 flex items-center" aria-label="Breadcrumb">
      <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
        <a className="hover:text-secondary" href="/">
          Home
        </a>
        <Slash className="w-4 h-4 mx-2" />
      </li>

      {paths.length !== 0 &&
        paths.map((path) => (
          <li
            key={path}
            className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
          >
            <a className="hover:text-secondary" href={`/${path}`}>
              {path}
            </a>
            <Slash className="w-4 h-4 mx-2" />
          </li>
        ))}
      <li
        className="text-sm font-semibold text-gray-800 truncate dark:text-gray-200"
        aria-current="page"
      >
        {leafPath}
      </li>
    </ol>
  );
}
