import { prisma } from "@/lib/prisma";
import { ClientSection } from "./client-section";

export default async function Projects() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      supervisor: { select: { name: true } },
    },
  });

  const data = projects.map(
    ({ id, title, description, supervisor: { name } }) => ({
      id,
      title,
      description,
      supervisorName: name,
    }),
  );

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">Projects</h1>
      </div>
      <ClientSection data={data} />
    </div>
  );
}
