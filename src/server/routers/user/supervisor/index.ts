import { instanceParamsSchema } from "@/lib/validations/params";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { Role } from "@prisma/client";
import { z } from "zod";

export const supervisorRouter = createTRPCRouter({
  instanceData: protectedProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        supervisorId: z.string(),
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          supervisorId,
        },
      }) => {
        return await ctx.db.userInInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: supervisorId,
          },
          select: {
            user: { select: { name: true, email: true } },
            supervisorProjects: { select: { id: true, title: true } },
          },
        });
      },
    ),

  projects: protectedProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const userId = ctx.session.user.id;
        const targets = 5;
        const projects = await ctx.db.project.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            supervisorId: userId,
          },
          select: {
            id: true,
            title: true,
            description: true,
          },
        });
        return { projects, targets };
      },
    ),

  delete: protectedProcedure
    .input(z.object({ params: instanceParamsSchema, supervisorId: z.string() }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          supervisorId,
        },
      }) => {
        await ctx.db.userInInstance.delete({
          where: {
            instanceMembership: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: supervisorId,
            },
          },
        });
      },
    ),

  deleteAll: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        await ctx.db.userInInstance.deleteMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.SUPERVISOR,
          },
        });
      },
    ),
});
