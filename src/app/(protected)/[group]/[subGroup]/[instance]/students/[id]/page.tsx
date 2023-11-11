// accessible by admins only

import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/prisma";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export default async function Student(
  context: z.infer<typeof routeContextSchema>,
) {
  const {
    params: { id },
  } = routeContextSchema.parse(context);

  const student = await db.student.findFirstOrThrow({
    where: { id },
    select: {
      name: true,
      schoolId: true,
      flags: { select: { title: true } },
      preferences: { select: { project: { select: { title: true } } } },
      shortlist: { select: { project: { select: { title: true } } } },
    },
  });

  const flags = student.flags.map((item) => item.title);
  const preferences = student.preferences.map((item) => item.project.title);
  const shortlist = student.shortlist.map((item) => item.project.title);

  return (
    <>
      <div className="flex w-2/3 max-w-7xl flex-col">
        <div className="flex rounded-md bg-accent px-6 py-5">
          <h1 className="text-5xl text-accent-foreground">{student.name}</h1>
        </div>
        <div className="mt-6 flex gap-6">
          <div className="flex w-3/4 flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
                Preferences:
              </h2>
              <ol>
                {preferences.length !== 0 ? (
                  preferences.map((preference, i) => (
                    <li key={i}>{preference}</li>
                  ))
                ) : (
                  <p>no preferences yet</p>
                )}
              </ol>
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
                Shortlist:
              </h2>
              <ul>
                {shortlist.length !== 0 ? (
                  shortlist.map((item, i) => <li key={i}>{item}</li>)
                ) : (
                  <p>no shortlisted items yet</p>
                )}
              </ul>
            </div>
          </div>
          <div className="flex w-1/4 flex-col gap-5 rounded-md bg-accent px-5 py-3">
            <div>
              <h2 className="text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
                School ID:
              </h2>
              <p>{student.schoolId}</p>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
                Flags:
              </h2>
              <div className="flex flex-col gap-2">
                {flags.map((flag) => (
                  <Badge key={flag} variant="outline">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
