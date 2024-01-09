import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";
import { z } from "zod";
import { ClientSection } from "./client-section";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export default async function Project(
  context: z.infer<typeof routeContextSchema>,
) {
  const {
    params: { id },
  } = routeContextSchema.parse(context);

  const studentId = "636d1a57-8ffb-4535-a43a-8a5536245bc1";

  let selectStatus = "none";

  const project = await db.project.findFirstOrThrow({
    where: { id },
    select: {
      title: true,
      description: true,
      supervisor: {
        select: { name: true, id: true },
      },
    },
  });

  const flags: string[] = [];
  const tags: string[] = [];

  const inStudentShortlist = !!(await db.shortlist.findFirst({
    where: {
      projectId: id,
      studentId,
    },
  }));

  if (inStudentShortlist) selectStatus = "shortlist";

  const inPreferences = !!(await db.preference.findFirst({
    where: {
      projectId: id,
      studentId,
    },
  }));

  if (inPreferences) selectStatus = "preference";

  return (
    <>
      <div className="flex w-2/3 max-w-7xl flex-col">
        <div className="flex items-center justify-between rounded-md bg-accent px-6 py-5">
          <h1 className="text-5xl text-accent-foreground">{project.title}</h1>
          <ClientSection
            studentId={studentId}
            projectId={id}
            defaultStatus={selectStatus}
          />
        </div>
        <div className="mt-6 flex gap-6">
          <div className="w-3/4">
            <h2 className="text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
              Description:
            </h2>
            <p>{project.description}</p>
          </div>
          <div className="flex w-1/4 flex-col gap-5 rounded-md bg-accent px-5 py-3">
            <div>
              <h2 className="text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
                Supervisor:
              </h2>
              <Link href={`/supervisors/${project.supervisor.id}`}>
                <Button className="text-lg" variant="link">
                  {project.supervisor.name}
                </Button>
              </Link>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
                Flags:
              </h2>
              {flags.map((flag) => (
                <Badge key={flag} variant="outline">
                  {flag}
                </Badge>
              ))}
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
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
