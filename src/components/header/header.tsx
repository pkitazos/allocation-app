import Image from "next/image";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { api } from "@/lib/trpc/server";

import { InstanceTabs } from "./client-header";
import { InstanceLink } from "./instance-link";
import { UserButton } from "./user-button";

import whiteLogo from "@/assets/uofg-white.png";

export async function Header() {
  const session = await auth();
  const adminPanel = await api.user.adminPanelRoute();

  return (
    <nav className="sticky top-0 z-50 flex h-[8dvh] max-h-[5rem] w-full items-center justify-between gap-6 bg-primary px-10 py-5 shadow-md">
      <Link href="/">
        <Image
          className="max-w-[10rem] object-scale-down"
          width={300}
          height={100}
          src={whiteLogo}
          alt=""
        />
      </Link>
      {session && (
        <div className="flex items-center gap-6">
          <InstanceTabs />
          {adminPanel && (
            <InstanceLink href={adminPanel}>Admin Panel</InstanceLink>
          )}
        </div>
      )}
      <UserButton />
    </nav>
  );
}
