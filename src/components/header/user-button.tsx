"use client";
import { LogIn, LogOut, User2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserButton() {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={session?.user?.image ?? ""} />
          <AvatarFallback>
            <User2 />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 mt-3 w-fit min-w-40 max-w-60">
        {session?.user && (
          <>
            <DropdownMenuLabel className="py-4">
              <div className="flex flex-col space-y-1 pb-2.5">
                <p className="text-sm font-medium leading-none">
                  {session?.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {session ? (
          <DropdownMenuItem
            className="flex items-center gap-2 text-base "
            onClick={async () => await signOut()}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="flex items-center gap-2 text-base "
            onClick={async () => await signIn()}
          >
            <LogIn className="h-4 w-4" />
            <span>Sign in</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
