import { prisma } from "@/lib/prisma";
import { randomChoice } from "@/lib/utils";
import { AllocationInstanceModel, FlagModel } from "@/types/zod";
import { AllocationInstance, Flag, Student } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { studentData } from "./data";

const dataSchema = z.object({
  flags: z.array(FlagModel),
  testInstance: AllocationInstanceModel,
});

export async function POST(req: NextRequest) {
  console.log("STUDENT");
  const data = await req.json();
  const result = dataSchema.safeParse(data);

  if (!result.success) return NextResponse.json({ status: 400 }); // TODO: add more informative message

  const { flags, testInstance }: z.infer<typeof dataSchema> = data;

  const students = await createStudent();
  await connectToStudent(students, flags, testInstance);
  await inviteStudent(students);

  console.log("ok");
  return NextResponse.json({ status: 200, data: students });
}

const createStudent = async () => {
  await prisma.student.createMany({ data: studentData });

  const students = await prisma.student.findMany({});
  return students;
};

const connectToStudent = async (
  students: Student[],
  flags: Flag[],
  testInstance: AllocationInstance,
) => {
  Promise.all(
    students.map(
      async ({ id }) =>
        await prisma.student.update({
          where: {
            id,
          },
          data: {
            flags: {
              connect: { title: randomChoice(flags).title },
            },
            allocationInstances: {
              connect: {
                id: testInstance.id,
              },
            },
          },
        }),
    ),
  );
};

const inviteStudent = async (students: Student[]) => {
  await prisma.invitation.createMany({
    data: students.map(({ email: userEmail }) => ({
      userEmail,
      role: "STUDENT" as const,
    })),
  });
};
