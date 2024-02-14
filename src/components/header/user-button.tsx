"use client";
import { User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { SignInButton } from "@/components/sign-in-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
      <DropdownMenuContent className="mt-3 max-w-60 p-2">
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
              <DropdownMenuSeparator />
            </DropdownMenuLabel>
          </>
        )}
        <DropdownMenuItem asChild>
          {session ? (
            <Button
              className="w-full"
              variant="outline"
              onClick={async () => await signOut()}
            >
              Sign out
            </Button>
          ) : (
            <SignInButton />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
