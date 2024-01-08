import Image from "next/image";
import Link from "next/link";

import whiteLogo from "@/assets/uofg-white.png";
import { auth } from "@/lib/auth";
import { api } from "@/lib/trpc/server";
import { HeaderTabs } from "./header-tabs";
import { UserButton } from "./user-button";

export async function Header() {
  const adminPanel = await api.user.adminPanelRoute.query();
  const session = await auth();

  return (
    <nav className="sticky top-0 flex h-[8dvh] max-h-[5rem] w-full items-center justify-between gap-6 bg-primary px-10 py-5">
      <Link href="/">
        <Image
          className="max-w-[10rem] object-scale-down"
          width={300}
          height={100}
          src={whiteLogo}
          alt=""
        />
      </Link>
      {session?.user && (
        <HeaderTabs user={session.user} adminPanel={adminPanel} />
      )}
      <UserButton />
    </nav>
  );
}
