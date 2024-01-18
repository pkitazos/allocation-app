import { slugify } from "@/lib/utils";
import { adminProcedure, createTRPCRouter } from "@/server/trpc";
import { subGroupParamsSchema } from "@/lib/validations/params";
import { z } from "zod";

export const subGroupRouter = createTRPCRouter({
  instanceManagement: adminProcedure
    .input(z.object({ params: subGroupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
        },
      }) => {
        const data = await ctx.db.allocationSubGroup.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            slug: subGroup,
          },
          select: {
            displayName: true,
            allocationInstances: true,
            subGroupAdmins: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
        const admin = ctx.session.user.role!;
        return { admin, ...data };
      },
    ),

  takenNames: adminProcedure
    .input(z.object({ params: subGroupParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup },
        },
      }) => {
        const data = await ctx.db.allocationSubGroup.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            slug: subGroup,
          },
          select: {
            allocationInstances: {
              select: {
                displayName: true,
              },
            },
          },
        });
        return data.allocationInstances.map((item) => item.displayName);
      },
    ),

  createInstance: adminProcedure
    .input(
      z.object({
        name: z.string(),
        params: subGroupParamsSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          name,
          params: { group, subGroup },
        },
      }) => {
        await ctx.db.allocationInstance.create({
          data: {
            displayName: name,
            slug: slugify(name),
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
          },
        });
      },
    ),
});
