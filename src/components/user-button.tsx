"use client";
import { User2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ButtonHTMLAttributes } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { accessibleBy } from "./header-tabs";

export function UserButton({
  className,
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const user = session?.user;

  return (
    <button className={className}>
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
            <>
              <DropdownMenuLabel className="py-4">
                <div className="flex flex-col space-y-1 pb-2.5">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
              </DropdownMenuLabel>

              {accessibleBy(user, ["STUDENT", "SUPERVISOR"]) && (
                <DropdownMenuItem>
                  <Link href="/account" className="w-full">
                    <Button variant="link">My account</Button>
                  </Link>
                </DropdownMenuItem>
              )}
            </>
          )}
          <DropdownMenuItem>
            {session ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={async () => await signOut()}
              >
                Sign out
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="outline"
                onClick={async () =>
                  await signIn("google", {
                    callbackUrl: searchParams?.get("from") ?? "/",
                  })
                }
              >
                Sign In
              </Button>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </button>
  );
}
