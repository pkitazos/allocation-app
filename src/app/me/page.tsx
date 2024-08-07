import { PageWrapper } from "@/components/page-wrapper";

import { slim_auth } from "@/lib/auth";

export default async function Page() {
  const user = await slim_auth();
  return (
    <PageWrapper className="grid place-items-center">
      {user ? (
        <div className="grid w-max grid-cols-3 gap-2">
          <p className="col-span-1 text-muted-foreground">ID:</p>
          <p className="col-span-2 font-semibold text-primary">{user.id}</p>
          <p className="col-span-1 text-muted-foreground">Name:</p>
          <p className="col-span-2 font-semibold text-primary">{user.name}</p>
          <p className="col-span-1 text-muted-foreground">Email:</p>
          <p className="col-span-2 font-semibold text-primary">{user.email}</p>
        </div>
      ) : (
        <p>not authenticated</p>
      )}
    </PageWrapper>
  );
}
