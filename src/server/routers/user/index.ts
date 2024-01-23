import { adminLevelOrd } from "@/lib/db";
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

  adminPanelRoute: publicProcedure
    .output(z.string().optional())
    .query(async ({ ctx }) => {
      const session = ctx.session;
      if (!session) return;

      const user = session.user;

      if (!user.role) return;

      if (user.role === "STUDENT" || user.role === "SUPERVISOR") return;

      const adminSpaces = await ctx.db.adminInSpace.findMany({
        where: { userId: user.id },
        select: {
          role: true,
          allocationGroupId: true,
          allocationSubGroupId: true,
        },
      });

      const {
        role,
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
      } = adminSpaces.sort(
        (a, b) => adminLevelOrd.indexOf(b.role) - adminLevelOrd.indexOf(a.role),
      )[0];

      if (role === "SUPER") return "/admin";
      if (role === "GROUP") return `/${group}`;
      if (role === "SUB_GROUP") return `/${group}/${subGroup}`;

      return;
    }),

  instances: protectedProcedure
    .output(
      z.array(
        z.object({
          allocationGroupId: z.string(),
          allocationSubGroupId: z.string(),
          allocationInstanceId: z.string(),
        }),
      ),
    )
    .query(async ({ ctx }) => {
      const user = ctx.session.user;

      const { role } = await ctx.db.user.findFirstOrThrow({
        where: { id: user.id },
        select: { role: true },
      });

      if (!role) return [];

      if (role === "ADMIN") {
        const adminSpaces = await ctx.db.adminInSpace.findMany({
          where: { userId: user.id },
          select: {
            role: true,
            allocationGroupId: true,
            allocationSubGroupId: true,
          },
        });

        const {
          role: adminLevel,
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
        } = adminSpaces.sort(
          (a, b) =>
            adminLevelOrd.indexOf(b.role) - adminLevelOrd.indexOf(a.role),
        )[0];

        if (adminLevel === "SUPER") {
          const d = await ctx.db.allocationInstance.findMany({
            select: {
              allocationGroupId: true,
              allocationSubGroupId: true,
              id: true,
            },
          });
          return d.map(({ allocationGroupId, allocationSubGroupId, id }) => ({
            allocationGroupId,
            allocationSubGroupId,
            allocationInstanceId: id,
          }));
        }

        if (adminLevel === "GROUP") {
          const d = await ctx.db.allocationGroup.findFirstOrThrow({
            where: { id: group! },
            select: {
              allocationSubGroups: {
                select: {
                  allocationInstances: {
                    select: {
                      allocationGroupId: true,
                      allocationSubGroupId: true,
                      id: true,
                    },
                  },
                },
              },
            },
          });
          return d.allocationSubGroups.flatMap(({ allocationInstances }) =>
            allocationInstances.map(
              ({ allocationGroupId, allocationSubGroupId, id }) => ({
                allocationGroupId,
                allocationSubGroupId,
                allocationInstanceId: id,
              }),
            ),
          );
        }

        if (adminLevel === "SUB_GROUP") {
          const d = await ctx.db.allocationSubGroup.findFirstOrThrow({
            where: { allocationGroupId: group!, id: subGroup! },
            select: {
              allocationInstances: {
                select: {
                  allocationGroupId: true,
                  allocationSubGroupId: true,
                  id: true,
                },
              },
            },
          });
          return d.allocationInstances.map(
            ({ allocationGroupId, allocationSubGroupId, id }) => ({
              allocationGroupId,
              allocationSubGroupId,
              allocationInstanceId: id,
            }),
          );
        }
      }

      return await ctx.db.userInInstance.findMany({
        where: { userId: user.id },
        select: {
          allocationGroupId: true,
          allocationSubGroupId: true,
          allocationInstanceId: true,
        },
      });
    }),
});
