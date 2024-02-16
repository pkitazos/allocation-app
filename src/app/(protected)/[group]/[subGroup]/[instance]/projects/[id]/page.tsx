import { Role } from "@prisma/client";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { PreferenceButton } from "./preference-button";

interface pageParams extends InstanceParams {
  id: string;
}

export default async function Project({ params }: { params: pageParams }) {
  const { id: projectId } = params;

  const project = await api.project.getById.query({ projectId });
  const role = await api.user.role.query({ params });

  const preferenceStatus =
    await api.user.student.preference.getForProject.query({
      params,
      projectId,
    });

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <div className="flex items-center justify-between rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">{project.title}</h1>
        {role === Role.STUDENT && (
          <PreferenceButton
            projectId={projectId}
            defaultStatus={preferenceStatus}
          />
        )}
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
            <Link href={`/supervisors/${project.supervisor.user.id}`}>
              <Button className="text-lg" variant="link">
                {project.supervisor.user.name}
              </Button>
            </Link>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
              Flags:
            </h2>
            {project.flagOnProjects.map(({ flag }, i) => (
              <Badge key={i} variant="outline">
                {flag.title}
              </Badge>
            ))}
          </div>
          <div>
            <h2 className="mb-2 text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
              Tags:
            </h2>
            {project.tagOnProject.map(({ tag }, i) => (
              <Badge key={i} variant="outline">
                {tag.title}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
