import { Separator } from "@/components/ui/separator";
import { UserInstances } from "@/components/user-instances";

import { auth } from "@/lib/auth";

// TODO: remove auth check, can assume that a user exists since the application is protected by shibboleth
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
      {!user ? (
        <>
          <Separator className="mt-4 w-1/2" />
          <div className="flex items-center gap-3 text-lg">
            Sign In to access the rest of the application
          </div>
        </>
      ) : (
        <div className="absolute bottom-0 w-full max-w-5xl">
          <UserInstances />
        </div>
      )}
    </div>
  );
}
