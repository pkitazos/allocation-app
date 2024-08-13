import { Separator } from "@/components/ui/separator";
import { UserInstances } from "@/components/user-instances";

import { auth } from "@/lib/auth";

export default async function Home() {
  const user = await auth();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-medium">
        Welcome{" "}
        {user && (
          <span className="font-semibold text-secondary">{user.name}</span>
        )}
        !
      </h1>
      <Separator className="my-4 w-1/3" />
      {user && (
        <div className="absolute bottom-0 w-full max-w-5xl">
          <UserInstances />
        </div>
      )}
    </div>
  );
}
