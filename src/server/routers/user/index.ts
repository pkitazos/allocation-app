import { permissionCheck } from "@/lib/db";
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
          adminLevel: true,
          allocationGroupId: true,
          allocationSubGroupId: true,
        },
      });

      if (adminSpaces.length === 0) return;

      const {
        adminLevel,
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
      } = adminSpaces.sort(({ adminLevel: a }, { adminLevel: b }) =>
        permissionCheck(a, b) ? 1 : 0,
      )[0];

      if (adminLevel === "SUPER") return "/admin";
      if (adminLevel === "GROUP") return `/${group}`;
      if (adminLevel === "SUB_GROUP") return `/${group}/${subGroup}`;

      return;
    }),

  instances: protectedProcedure.query(async ({ ctx }) => {
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
          adminLevel: true,
          allocationGroupId: true,
          allocationSubGroupId: true,
        },
      });

      const {
        adminLevel: adminLevel,
        allocationGroupId: group,
        allocationSubGroupId: subGroup,
      } = adminSpaces.sort(({ adminLevel: a }, { adminLevel: b }) =>
        permissionCheck(a, b) ? 1 : 0,
      )[0];

      if (adminLevel === "SUPER") {
        const data = await ctx.db.allocationInstance.findMany({
          select: {
            allocationSubGroup: {
              select: {
                allocationGroup: { select: { displayName: true } },
                displayName: true,
              },
            },
            displayName: true,
            allocationGroupId: true,
            allocationSubGroupId: true,
            id: true,
          },
        });
        return data.map(
          ({
            allocationGroupId,
            allocationSubGroupId,
            id,
            displayName,
            allocationSubGroup: {
              displayName: subGroupName,
              allocationGroup: { displayName: groupName },
            },
          }) => ({
            group: {
              id: allocationGroupId,
              displayName: groupName,
            },
            subGroup: {
              id: allocationSubGroupId,
              displayName: subGroupName,
            },
            instance: {
              id,
              displayName,
            },
          }),
        );
      }

      if (adminLevel === "GROUP") {
        const { displayName: groupName, allocationSubGroups } =
          await ctx.db.allocationGroup.findFirstOrThrow({
            where: { id: group! },
            select: {
              displayName: true,
              allocationSubGroups: {
                select: {
                  displayName: true,
                  allocationInstances: {
                    select: {
                      displayName: true,
                      allocationGroupId: true,
                      allocationSubGroupId: true,
                      id: true,
                    },
                  },
                },
              },
            },
          });

        return allocationSubGroups.flatMap(
          ({ displayName: subGroupName, allocationInstances }) =>
            allocationInstances.map(
              ({
                displayName,
                id,
                allocationGroupId,
                allocationSubGroupId,
              }) => ({
                group: {
                  id: allocationGroupId,
                  displayName: groupName,
                },
                subGroup: {
                  id: allocationSubGroupId,
                  displayName: subGroupName,
                },
                instance: {
                  id,
                  displayName,
                },
              }),
            ),
        );
      }

      if (adminLevel === "SUB_GROUP") {
        const {
          allocationGroup: { displayName: groupName },
          displayName: subGroupName,
          allocationInstances,
        } = await ctx.db.allocationSubGroup.findFirstOrThrow({
          where: { allocationGroupId: group!, id: subGroup! },
          select: {
            allocationGroup: { select: { displayName: true } },
            displayName: true,
            allocationInstances: {
              select: {
                displayName: true,
                allocationGroupId: true,
                allocationSubGroupId: true,
                id: true,
              },
            },
          },
        });
        return allocationInstances.map(
          ({ allocationGroupId, allocationSubGroupId, id, displayName }) => ({
            group: {
              id: allocationGroupId,
              displayName: groupName,
            },
            subGroup: {
              id: allocationSubGroupId,
              displayName: subGroupName,
            },
            instance: {
              id,
              displayName,
            },
          }),
        );
      }
    }

    const res = await ctx.db.userInInstance.findMany({
      where: { userId: user.id },
      select: {
        allocationGroupId: true,
        allocationSubGroupId: true,
        allocationInstanceId: true,
        // TODO: fix broken relation
        // allocationInstance: {
        //   select: {
        //     displayName: true,
        //     allocationSubGroup: {
        //       select: {
        //         displayName: true,
        //         allocationGroup: { select: { displayName: true } },
        //       },
        //     },
        //   },
        // },
      },
    });

    const data: {
      allocationGroupId: string;
      allocationSubGroupId: string;
      id: string;
      allocationSubGroup: {
        allocationGroup: {
          displayName: string;
        };
        displayName: string;
      };
      displayName: string;
    }[] = [];

    for (const item of res) {
      const temp = await ctx.db.allocationInstance.findFirstOrThrow({
        where: {
          allocationGroupId: item.allocationGroupId,
          allocationSubGroupId: item.allocationSubGroupId,
          id: item.allocationInstanceId,
        },
        select: {
          displayName: true,
          id: true,
          allocationSubGroupId: true,
          allocationGroupId: true,
          allocationSubGroup: {
            select: {
              displayName: true,
              allocationGroup: {
                select: {
                  displayName: true,
                },
              },
            },
          },
        },
      });
      data.push(temp);
    }

    return data.map(
      ({
        allocationGroupId,
        allocationSubGroupId,
        id,
        displayName,
        allocationSubGroup: {
          displayName: subGroupName,
          allocationGroup: { displayName: groupName },
        },
      }) => ({
        group: {
          id: allocationGroupId,
          displayName: groupName,
        },
        subGroup: {
          id: allocationSubGroupId,
          displayName: subGroupName,
        },
        instance: {
          id,
          displayName,
        },
      }),
    );
  }),
});
