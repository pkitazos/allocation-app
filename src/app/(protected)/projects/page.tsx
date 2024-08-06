"use client";

import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";

export default function Page() {
  const { mutateAsync, data } = api.test.useMutation();
  return (
    <PageWrapper className="grid place-items-center">
      <Button onClick={() => mutateAsync()}>get user</Button>
      {data && data.user ? (
        <div>
          <p>{data.user.id}</p>
          <p>{data.user.name}</p>
          <p>{data.user.email}</p>
          {/* <p>{data.user.role}</p> */}
        </div>
      ) : (
        <p>no user</p>
      )}
    </PageWrapper>
  );
}
