import { flags } from "@/data/flags";
import { students as studentData } from "@/data/students";
import { prisma } from "@/lib/prisma";
import { randomChoice } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  await prisma.student.createMany({
    data: studentData,
  });

  const studentIds = await prisma.student.findMany({
    select: { id: true },
  });

  Promise.all(
    studentIds.map(
      async ({ id: studentId }, i) =>
        await prisma.student.update({
          where: {
            id: studentId,
          },
          data: {
            flags: {
              connect: randomChoice(flags),
            },
          },
        }),
    ),
  );

  return NextResponse.json({ status: 200, data: "success" });
}

// TODO: add error handling, auth check and data validation

//   const { params } = routeContextSchema.parse(context);

//   const res = await userAuth();

//   if (res.status !== 200) {
//     return NextResponse.json({ error: res.message }, { status: res.status });
//   }

//   const data = await req.json();
//   const result = dataSchema.safeParse(data);

//   if (!result.success) {
//     return NextResponse.json({ status: 400 });
//   }
