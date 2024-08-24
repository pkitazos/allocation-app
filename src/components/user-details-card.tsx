import { ClassValue } from "clsx";
import { HashIcon, UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { User } from "@/lib/validations/auth";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function UserDetailsCard({
  user,
  className,
  full = false,
}: {
  user: User;
  className?: ClassValue;
  full?: boolean;
}) {
  if (!full) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">User Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-evenly gap-4">
            <div className="flex items-center">
              <UserIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="mr-2 font-semibold">ID:</span>
              {user.id}
            </div>
            <div className="flex items-center">
              <HashIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="mr-2 font-semibold">Email:</span>
              {user.email}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" />
            <AvatarFallback>
              <UserIcon className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">user</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center">
            <UserIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="mr-2 font-semibold">ID:</span>
            {user.id}
          </div>
          <div className="flex items-center">
            <HashIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="mr-2 font-semibold">Email:</span>
            {user.email}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
