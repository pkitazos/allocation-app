"use client";
import { User2 } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
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
import { Session } from "next-auth/types";

export function UserButton({ session }: { session: Session | null }) {
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
      <DropdownMenuContent className="mt-3 w-60">
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
              onClick={async () => await signIn("google")}
            >
              Sign In
            </Button>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
