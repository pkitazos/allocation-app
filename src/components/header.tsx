"use client";
import { useClearance } from "@/app/clearance";
import whiteLogo from "@/assets/uofg-white.png";
import Image from "next/image";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";

function UserButton() {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.image ?? ""} />
          <AvatarFallback>
            <User2 />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-3 w-60">
        {user && (
          <DropdownMenuLabel className="py-4">
            <div className="flex flex-col space-y-1 pb-2.5">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
            <DropdownMenuSeparator />
          </DropdownMenuLabel>
        )}
        <DropdownMenuItem>
          <Link href="/account" className="w-full">
            <Button className="w-full" variant="link" onClick={() => signOut()}>
              My account
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {session ? (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => signOut()}
            >
              Sign out
            </Button>
          ) : (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const [userClearance, _recompute] = useClearance();

  return (
    <>
      <nav className="fixed flex h-[8dvh] max-h-[5rem] w-full items-center justify-center gap-6 bg-primary py-5">
        <a href="/">
          <Image
            className="max-w-[10rem] object-scale-down"
            width={300}
            height={100}
            src={whiteLogo}
            alt="University of Glasgow logo"
          />
        </a>
        <a className="text-white hover:underline" href="/projects">
          <Button variant="ghost">Projects</Button>
        </a>
        {userClearance === 0 && (
          <a className="text-white hover:underline" href="/preferences">
            <Button variant="ghost">Preferences</Button>
          </a>
        )}
        {userClearance >= 1 && (
          <a className="text-white hover:underline" href="/students">
            <Button variant="ghost">Students</Button>
          </a>
        )}
        {userClearance >= 2 && (
          <a className="text-white hover:underline" href="/admin-panel">
            <Button variant="ghost">Admin Panel</Button>
          </a>
        )}
        <a className="text-white hover:underline" href="/help">
          <Button variant="ghost">Help</Button>
        </a>
        <UserButton />
      </nav>
    </>
  );
}
