import { HashIcon, UserIcon } from "lucide-react";

import { User } from "@/lib/validations/auth";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

export function UserDetailsCard({
  user,
  className,
}: {
  user: User;
  className?: ClassValue;
}) {
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
