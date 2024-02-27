import { Role, Stage } from "@prisma/client";
import Link from "next/link";

import { Heading, SubHeading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/trpc/server";
import { stageCheck } from "@/lib/utils/permissions/stage-check";
import { InstanceParams } from "@/lib/validations/params";

import { PreferenceButton } from "./_components/preference-button";
import { ProjectRemovalButton } from "./_components/project-removal-button";

interface pageParams extends InstanceParams {
  id: string;
}

export default async function Project({ params }: { params: pageParams }) {
  const { id: projectId } = params;

  const project = await api.project.getById({ projectId });
  const { user, role } = await api.user.userRole({ params });
  const stage = await api.institution.instance.currentStage({ params });

  const preferenceStatus = await api.user.student.preference.getForProject({
    params,
    projectId,
  });

  return (
    <PageWrapper>
      <Heading className="flex items-center justify-between">
        {project.title}
        {role === Role.STUDENT && stage === Stage.PROJECT_SELECTION && (
          <PreferenceButton
            projectId={projectId}
            defaultStatus={preferenceStatus}
          />
        )}
        {(role === Role.ADMIN || project.supervisor.user.id === user.id) &&
          !stageCheck(stage, Stage.PROJECT_ALLOCATION) && (
            <ProjectRemovalButton projectId={projectId} />
          )}
      </Heading>
      <div className="mt-6 flex gap-6">
        <div className="w-3/4">
          <SubHeading>Description</SubHeading>
          <p className="mt-6">{project.description}</p>
        </div>
        <div className="flex w-1/4 flex-col gap-5 rounded-md bg-accent px-5 py-3">
          <div>
            <h2 className="text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
              Supervisor:
            </h2>
            <Link href={`../supervisors/${project.supervisor.user.id}`}>
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
    </PageWrapper>
  );
}
