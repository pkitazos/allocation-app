import { PrismaClient } from "@prisma/client";

import { expand } from "@/lib/utils/general/instance-params";
import { matchingResultSchema } from "@/lib/validations/matching";
import { InstanceParams } from "@/lib/validations/params";

export async function getUnallocatedStudents(
  db: PrismaClient,
  params: InstanceParams,
  selectedAlgName: string,
) {
  const students = await db.studentDetails
    .findMany({
      where: expand(params),
      select: {
        studentLevel: true,
        userInInstance: {
          select: {
            studentAllocation: { select: { project: true } },
            user: true,
          },
        },
      },
    })
    .then((d) =>
      d.map((s) => ({
        student: { ...s.userInInstance.user, level: s.studentLevel },
        project: s.userInInstance.studentAllocation?.project,
      })),
    );

  const { matching } = await db.algorithm
    .findFirstOrThrow({
      where: { ...expand(params), algName: selectedAlgName },
      select: { matchingResultData: true },
    })
    .then(({ matchingResultData }) =>
      matchingResultSchema.parse(JSON.parse(matchingResultData as string)),
    );

  const matchedStudentIds = new Set(matching.map((m) => m.student_id));

  return students.filter((s) => !matchedStudentIds.has(s.student.id));
}
