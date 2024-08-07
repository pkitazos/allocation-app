import { SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { api } from "@/lib/trpc/server";

import { InstanceHeader } from "./instance-header";
import { InstanceLink } from "./instance-link";
import { UserButton } from "./user-button";

import whiteLogo from "@/assets/uofg-white.png";
import { slim_auth } from "@/lib/auth";

export async function Header() {
  // TODO: refactor once new auth is implemented, can assume that user will be signed in
  const user = await slim_auth();
  const adminPanel = await api.user.adminPanelRoute();

  return (
    <nav className="sticky top-0 z-50 flex h-[8dvh] max-h-[5rem] w-full items-center justify-between gap-6 bg-primary px-10 py-5 shadow-md">
      <Link className="basis-1/4" href="/">
        <Image
          className="max-w-[10rem] object-scale-down"
          width={300}
          height={100}
          src={whiteLogo}
          alt=""
        />
      </Link>
      {user && (
        <div className="flex w-full flex-grow justify-between">
          <InstanceHeader />
        </div>
      )}
      <div className="flex basis-1/4 items-center justify-end gap-4">
        {adminPanel && (
          <InstanceLink
            className="flex items-center gap-2 border"
            href={adminPanel}
          >
            <SlidersHorizontal className="h-4 w-4" />
            My Admin Panel
          </InstanceLink>
        )}
        <UserButton />
      </div>
    </nav>
  );
}
