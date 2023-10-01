// accessible by Supervisors + Admins

import { prisma } from "@/lib/prisma";
import { ClientSection } from "./client-section";

export default async function Page() {
  const supervisors = await prisma.supervisor.findMany({});

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">Supervisors</h1>
      </div>
      <ClientSection data={supervisors} />
    </div>
  );
}
