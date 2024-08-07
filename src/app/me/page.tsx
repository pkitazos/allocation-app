import { PageWrapper } from "@/components/page-wrapper";
import { slim_auth } from "@/lib/auth/new-auth";

export default async function Page() {
  const session = await slim_auth();

  return (
    <PageWrapper className="grid place-items-center">
      {session && session.user ? (
        <div>
          <p>{session.user.id}</p>
          <p>{session.user.name}</p>
          <p>{session.user.email}</p>
        </div>
      ) : (
        <p>not authenticated</p>
      )}
    </PageWrapper>
  );
}
