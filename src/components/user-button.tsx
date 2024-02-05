"use client";
import { roleCheck } from "@/lib/utils/role-check";
import { Role } from "@prisma/client";
import { User2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
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

export function UserButton({ role }: { role: Role }) {
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
          <>
            <DropdownMenuLabel className="py-4">
              <div className="flex flex-col space-y-1 pb-2.5">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <DropdownMenuSeparator />
            </DropdownMenuLabel>

            {roleCheck(role, [Role.STUDENT, Role.SUPERVISOR]) && (
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
