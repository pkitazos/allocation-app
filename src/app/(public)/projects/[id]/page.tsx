import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export default async function Project(
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { id },
  } = routeContextSchema.parse(context);

  const project = await prisma.project.findFirstOrThrow({
    where: { id },
    select: {
      title: true,
      description: true,
      supervisor: {
        select: { name: true },
      },
      flags: { select: { title: true } },
      tags: { select: { title: true } },
    },
  });

  const flags = project.flags.map((item) => item.title);
  const tags = project.tags.map((item) => item.title);

  return (
    <>
      <div className="flex flex-col w-2/3 max-w-7xl">
        <div className="flex rounded-md bg-accent py-5 px-6">
          <h1 className="text-5xl text-accent-foreground">{project.title}</h1>
        </div>
        <div className="mt-6 flex gap-6">
          <div className="w-3/4">
            <h2 className="text-lg font-bold text-primary underline underline-offset-2 decoration-secondary decoration-[3px]">
              Description:
            </h2>
            <p>{project.description}</p>
          </div>
          <div className="w-1/4 flex flex-col gap-5 rounded-md bg-accent py-3 px-5">
            <div>
              <h2 className="text-lg font-bold text-primary underline underline-offset-2 decoration-secondary decoration-[3px]">
                Supervisor:
              </h2>
              <p>{project.supervisor.name}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary underline underline-offset-2 decoration-secondary decoration-[3px]">
                Flags:
              </h2>
              {flags.map((flag) => (
                <Badge key={flag} variant="outline">
                  {flag}
                </Badge>
              ))}
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary underline underline-offset-2 decoration-secondary decoration-[3px]">
                Tags:
              </h2>
              {tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
