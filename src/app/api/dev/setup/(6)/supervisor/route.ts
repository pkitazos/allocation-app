import { prisma } from "@/lib/prisma";
import { AllocationInstanceModel } from "@/types/zod";
import { AllocationInstance, Supervisor } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supervisorData } from "./data";

const dataSchema = z.object({
  testInstance: AllocationInstanceModel,
});

export async function POST(req: NextRequest) {
  console.log("SUPERVISOR");
  const data = await req.json();
  const result = dataSchema.safeParse(data);

  if (!result.success) return NextResponse.json({ status: 400 }); // TODO: add more informative message

  const { testInstance }: z.infer<typeof dataSchema> = data;

  const supervisors = await createSupervisor();
  await connectToSupervisor(supervisors, testInstance);
  await inviteSupervisor(supervisors);
  console.log("ok");

  return NextResponse.json({ status: 200, data: supervisors });
}

const createSupervisor = async () => {
  await prisma.supervisor.createMany({ data: supervisorData });

  const supervisors = await prisma.supervisor.findMany();
  return supervisors;
};

const connectToSupervisor = async (
  supervisors: Supervisor[],
  testInstance: AllocationInstance,
) => {
  Promise.all(
    supervisors.map(
      async ({ id }) =>
        await prisma.supervisor.update({
          where: {
            id,
          },
          data: {
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

const inviteSupervisor = async (supervisors: Supervisor[]) => {
  await prisma.invitation.createMany({
    data: supervisors.map(({ email: userEmail }) => ({
      userEmail,
      role: "SUPERVISOR" as const,
    })),
  });
};
