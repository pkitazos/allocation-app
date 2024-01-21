import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc";
import { z } from "zod";
import { studentRouter } from "./student";
import { supervisorRouter } from "./supervisor";

export const userRouter = createTRPCRouter({
  student: studentRouter,
  supervisor: supervisorRouter,

  role: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input: { userId } }) => {
      return ctx.db.user.findFirstOrThrow({
        where: {
          id: userId,
        },
        select: {
          role: true,
        },
      });
    }),

  adminPanelRoute: publicProcedure
    .output(z.string().optional())
    .query(async ({ ctx }) => {
      const session = ctx.session;
      if (!session) return;

      const user = session.user;

      if (!user.role) return;

      if (user.role === "SUPER_ADMIN") return "/admin";

      // TODO: fix procedure
      if (user.role === "GROUP_ADMIN") {
        // const { allocationGroupId }
        await ctx.db.groupAdmin.findFirst({
          where: { id: user.id }, // ! id and user.id are not the same
          select: { allocationGroupId: true },
        });
        return `/${0}`;
      }

      if (user.role === "SUB_GROUP_ADMIN") {
        // const { allocationGroupId, allocationSubGroupId }
        await ctx.db.subGroupAdmin.findFirst({
          where: { id: user.id }, // ! id and user.id are not the same
          select: {
            allocationGroupId: true,
            allocationSubGroupId: true,
          },
        });
        return `/${0}/${0}`;
      }

      return;
    }),

  instances: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    const role = ctx.session.role;

    if (role === "SUPERVISOR") {
      return await ctx.db.supervisorInInstance.findMany({
        where: {
          supervisorId: id,
        },
        select: {
          allocationGroupId: true,
          allocationSubGroupId: true,
          allocationInstanceId: true,
        },
      });
    }

    if (role === "STUDENT") {
      return await ctx.db.studentInInstance.findMany({
        where: {
          studentId: id,
        },
        select: {
          allocationGroupId: true,
          allocationSubGroupId: true,
          allocationInstanceId: true,
        },
      });
    }

    if (role === "SUB_GROUP_ADMIN") {
      const data = await ctx.db.subGroupAdmin.findFirstOrThrow({
        where: { id },
        select: {
          allocationSubGroup: {
            select: {
              allocationInstances: {
                select: {
                  allocationGroupId: true,
                  allocationSubGroupId: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      return data.allocationSubGroup.allocationInstances.map((item) => ({
        allocationGroupId: item.allocationGroupId,
        allocationSubGroupId: item.allocationSubGroupId,
        allocationInstanceId: item.slug,
      }));
    }

    if (role === "GROUP_ADMIN") {
      const data = await ctx.db.groupAdmin.findFirstOrThrow({
        where: { id },
        select: {
          allocationGroup: {
            select: {
              allocationSubGroups: {
                select: {
                  allocationInstances: {
                    select: {
                      allocationGroupId: true,
                      allocationSubGroupId: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return data.allocationGroup.allocationSubGroups
        .flatMap((item) => item.allocationInstances)
        .map((item) => ({
          allocationGroupId: item.allocationGroupId,
          allocationSubGroupId: item.allocationSubGroupId,
          allocationInstanceId: item.slug,
        }));
    }

    const instances = await ctx.db.allocationInstance.findMany({
      select: {
        allocationGroupId: true,
        allocationSubGroupId: true,
        slug: true,
      },
    });

    return instances.map((item) => ({
      allocationGroupId: item.allocationGroupId,
      allocationSubGroupId: item.allocationSubGroupId,
      allocationInstanceId: item.slug,
    }));
  }),
});
