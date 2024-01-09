// accessible by all users

import { db } from "@/lib/db";
import { z } from "zod";
import { ClientSection } from "./client-section";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export default async function Page(
  context: z.infer<typeof routeContextSchema>,
) {
  const {
    params: { id },
  } = routeContextSchema.parse(context);

  const supervisor = await db.supervisor.findFirstOrThrow({
    where: { id },
    select: {
      name: true,
    },
  });

  const projects = await db.project.findMany({
    where: {
      supervisor: {
        id,
      },
    },
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <>
      <div className="flex w-2/3 max-w-7xl flex-col">
        <div className="flex rounded-md bg-accent px-6 py-5">
          <h1 className="text-5xl text-accent-foreground">{supervisor.name}</h1>
        </div>
        <div className="mt-6 flex gap-6">
          <ClientSection data={projects} />
        </div>
      </div>
    </>
  );
}
