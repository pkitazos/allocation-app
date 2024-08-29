import { PreferenceType, PrismaClient } from "@prisma/client";

import { BoardColumn, ProjectPreference } from "@/lib/validations/board";
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

  const columns: BoardColumn[] = [
    { id: PreferenceType.PREFERENCE, displayName: "Preference List" },
    { id: PreferenceType.SHORTLIST, displayName: "Shortlist" },
  ];

  const projects: ProjectPreference[] = res.map((e) => ({
    id: e.project.id,
    title: e.project.title,
    columnId: e.type,
    rank: e.rank,
    supervisorId: e.project.supervisor.user.id,
    supervisorName: e.project.supervisor.user.name!,
    changed: false,
  }));

  return { columns, projects };
}
