import { SignInButton } from "@/components/sign-in-button";
import { Separator } from "@/components/ui/separator";
import { UserInstances } from "@/components/user-instances";

import { auth } from "@/lib/auth";
import { getShibbolethUser } from "@/services/shibbolethAuth";
import { ShibbolethUserProvider } from "@/services/ShibbolethUserContext";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  const shibbolethUser = getShibbolethUser();

  return (
    <ShibbolethUserProvider user={shibbolethUser}>
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-medium">
          Welcome{" "}
          {shibbolethUser?.displayName && (
            <span className="font-semibold text-secondary">{shibbolethUser.displayName}, GUID:{shibbolethUser.guid}</span>
          )}
          !
        </h1>
        {!user ? (
          <>
            <Separator className="mt-4 w-1/2" />
            <div className="flex items-center gap-3 text-lg">
              <SignInButton />
              to access the rest of the application
            </div>
          </>
        ) : (
          <div className="absolute bottom-0 w-full max-w-5xl">
            <UserInstances />
          </div>
        )}
      </div>
    </ShibbolethUserProvider>
  );
}
