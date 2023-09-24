import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function DELETE(
  _req: NextRequest,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { id },
  } = routeContextSchema.parse(context);

  await prisma.student.delete({ where: { id } });

  return NextResponse.json({ status: 200, data: "success" });
}
