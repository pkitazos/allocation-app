import { Role, Stage } from "@prisma/client";
import Link from "next/link";

import { AccessControl } from "@/components/access-control";
import { Heading, SubHeading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/trpc/server";
import { cn } from "@/lib/utils";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { previousStages } from "@/lib/utils/permissions/stage-check";
import { InstanceParams } from "@/lib/validations/params";

import { StudentPreferenceButton } from "./_components/student-preference-button";

interface pageParams extends InstanceParams {
  id: string;
}

export default async function Project({ params }: { params: pageParams }) {
  const { id: projectId } = params;
  const instancePath = formatParamsAsPath(params);

  const project = await api.project.getById({ projectId });
  console.log({ techRequirements: project.specialTechnicalRequirements });
  const user = await api.user.get();

  const preferenceStatus = await api.user.student.preference.getForProject({
    params,
    projectId,
  });

  return (
    <PageWrapper>
      <Heading className="flex items-center justify-between">
        {project.title}
        <AccessControl
          allowedRoles={[Role.STUDENT]}
          allowedStages={[Stage.PROJECT_SELECTION]}
        >
          <StudentPreferenceButton
            projectId={projectId}
            defaultStatus={preferenceStatus}
          />
        </AccessControl>
        <AccessControl
          allowedRoles={[Role.ADMIN]}
          allowedStages={previousStages(Stage.PROJECT_SELECTION)}
          extraConditions={{ RBAC: { OR: project.supervisor.id === user.id } }}
        >
          <Button asChild>
            <Link href={`${instancePath}/projects/${projectId}/edit`}>
              Edit or Delete
            </Link>
          </Button>
        </AccessControl>
      </Heading>
      <div className="mt-6 flex gap-6">
        <div className="w-3/4">
          <SubHeading>Description</SubHeading>
          <p className="mt-6">{project.description}</p>
        </div>
        <div
          className={cn(
            "",
            (project.specialTechnicalRequirements === "" ||
              project.specialTechnicalRequirements === null) &&
              "hidden",
          )}
        >
          <SubHeading>Special Technical Requirements</SubHeading>
          <p className="mt-6">{project.specialTechnicalRequirements}</p>
        </div>
        <div className="flex w-1/4 flex-col gap-5 rounded-md bg-accent px-5 py-3">
          <div>
            <h2 className="text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2">
              Supervisor:
            </h2>
            <Link href={`../supervisors/${project.supervisor.id}`}>
              <Button className="text-lg" variant="link">
                {project.supervisor.name}
              </Button>
            </Link>
          </div>
          <div>
            <h2
              className={cn(
                "mb-2 text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2",
                project.flags.length === 0 && "hidden",
              )}
            >
              Flags:
            </h2>
            {project.flags.map((flag, i) => (
              <Badge key={i} variant="outline">
                {flag.title}
              </Badge>
            ))}
          </div>
          <div>
            <h2
              className={cn(
                "mb-2 text-lg font-bold text-primary underline decoration-secondary decoration-[3px] underline-offset-2",
                project.tags.length === 0 && "hidden",
              )}
            >
              Tags:
            </h2>
            {project.tags.map((tag, i) => (
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
