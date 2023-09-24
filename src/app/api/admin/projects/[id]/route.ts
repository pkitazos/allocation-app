import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
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

  await prisma.project.delete({ where: { id } });
}
