import { PreferenceType, PrismaClient } from "@prisma/client";

import { ProjectPreferenceCardDto } from "@/lib/validations/board";
import { InstanceParams } from "@/lib/validations/params";

export async function getBoardState(
  db: PrismaClient,
  params: InstanceParams,
  studentId: string,
) {
  const res = await db.preference.findMany({
    where: {
      allocationGroupId: params.group,
      allocationSubGroupId: params.subGroup,
      allocationInstanceId: params.instance,
      userId: studentId,
    },
    select: {
      project: {
        select: {
          id: true,
          title: true,
          supervisor: {
            select: { user: { select: { id: true, name: true } } },
          },
        },
      },
      rank: true,
      type: true,
    },
    orderBy: { rank: "asc" },
  });

  const allProjects = res.map((e) => ({
    id: e.project.id,
    title: e.project.title,
    columnId: e.type,
    rank: e.rank,
    supervisor: e.project.supervisor.user,
  }));

  const projects: Record<PreferenceType, ProjectPreferenceCardDto[]> = {
    [PreferenceType.PREFERENCE]: allProjects.filter(
      (e) => e.columnId === PreferenceType.PREFERENCE,
    ),

    [PreferenceType.SHORTLIST]: allProjects.filter(
      (e) => e.columnId === PreferenceType.SHORTLIST,
    ),
  };

  return { projects };
}
