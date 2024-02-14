import { AdminLevel, AllocationInstance, Role } from "@prisma/client";
import { z } from "zod";

import { permissionCheck } from "@/lib/utils/permissions/permission-check";
import { instanceParamsSchema } from "@/lib/validations/params";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc";

import { studentRouter } from "./student";
import { supervisorRouter } from "./supervisor";
import {
  formatInstanceData,
  getGroupInstances,
  getSubGroupInstances,
  getUserInstances,
} from "@/server/utils/user-instances";

export const userRouter = createTRPCRouter({
  student: studentRouter,
  supervisor: supervisorRouter,

  role: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const user = ctx.session.user;
        const userInInstance = await ctx.db.userInInstance.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: user.id,
          },
        });

        if (!userInInstance) return Role.ADMIN;
        return userInInstance.role;
      },
    ),

  adminPanelRoute: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) return;

    const user = ctx.session.user;

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

  instances: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) return [];

    const user = ctx.session.user;

    const allGroups = await ctx.db.allocationGroup.findMany({
      include: { allocationSubGroups: true },
    });

    const adminSpaces = await ctx.db.adminInSpace.findMany({
      where: { userId: user.id },
      include: {
        allocationSubGroup: { include: { allocationInstances: true } },
        allocationGroup: {
          include: {
            allocationSubGroups: { include: { allocationInstances: true } },
          },
        },
      },
    });

    if (adminSpaces.length === 0) {
      // you are not an admin anywhere
      // you are a supervisor or student
      const userInstances = await getUserInstances(ctx.db, user.id);
      return userInstances.map((instance) =>
        formatInstanceData(allGroups, instance),
      );
    }

    if (
      adminSpaces.length === 1 &&
      adminSpaces[0].adminLevel === AdminLevel.SUPER
    ) {
      // you are a super-admin
      const allInstances = await ctx.db.allocationInstance.findMany({});
      return allInstances.map((instance) =>
        formatInstanceData(allGroups, instance),
      );
    }

    // otherwise your adminSpaces array is made up of some combination of groupIds and subGroupIds
    // regardless, for eac of those, I must get all its instances

    const adminInstances: AllocationInstance[] = [];

    for (const s of adminSpaces) {
      if (s.allocationGroup) {
        const instances = getGroupInstances(s.allocationGroup);
        adminInstances.push(...instances);
        continue;
      }
      if (s.allocationSubGroup) {
        const instances = getSubGroupInstances(s.allocationSubGroup);
        adminInstances.push(...instances);
        continue;
      }
    }

    return adminInstances.map((instance) =>
      formatInstanceData(allGroups, instance),
    );
  }),
});
// if (role === "ADMIN") {
//   const adminSpaces = await ctx.db.adminInSpace.findMany({
//     where: { userId: user.id },
//     select: {
//       adminLevel: true,
//       allocationGroupId: true,
//       allocationSubGroupId: true,
//     },
//   });

//   const {
//     adminLevel: adminLevel,
//     allocationGroupId: group,
//     allocationSubGroupId: subGroup,
//   } = adminSpaces.sort(({ adminLevel: a }, { adminLevel: b }) =>
//     permissionCheck(a, b) ? 1 : 0,
//   )[0];

//   if (adminLevel === "SUPER") {
//     const data = await ctx.db.allocationInstance.findMany({
//       select: {
//         allocationSubGroup: {
//           select: {
//             allocationGroup: { select: { displayName: true } },
//             displayName: true,
//           },
//         },
//         displayName: true,
//         allocationGroupId: true,
//         allocationSubGroupId: true,
//         id: true,
//       },
//     });
//     return data.map(
//       ({
//         allocationGroupId,
//         allocationSubGroupId,
//         id,
//         displayName,
//         allocationSubGroup: {
//           displayName: subGroupName,
//           allocationGroup: { displayName: groupName },
//         },
//       }) => ({
//         group: {
//           id: allocationGroupId,
//           displayName: groupName,
//         },
//         subGroup: {
//           id: allocationSubGroupId,
//           displayName: subGroupName,
//         },
//         instance: {
//           id,
//           displayName,
//         },
//       }),
//     );
//   }

//   if (adminLevel === "GROUP") {
//     const { displayName: groupName, allocationSubGroups } =
//       await ctx.db.allocationGroup.findFirstOrThrow({
//         where: { id: group! },
//         select: {
//           displayName: true,
//           allocationSubGroups: {
//             select: {
//               displayName: true,
//               allocationInstances: {
//                 select: {
//                   displayName: true,
//                   allocationGroupId: true,
//                   allocationSubGroupId: true,
//                   id: true,
//                 },
//               },
//             },
//           },
//         },
//       });

//     return allocationSubGroups.flatMap(
//       ({ displayName: subGroupName, allocationInstances }) =>
//         allocationInstances.map(
//           ({
//             displayName,
//             id,
//             allocationGroupId,
//             allocationSubGroupId,
//           }) => ({
//             group: {
//               id: allocationGroupId,
//               displayName: groupName,
//             },
//             subGroup: {
//               id: allocationSubGroupId,
//               displayName: subGroupName,
//             },
//             instance: {
//               id,
//               displayName,
//             },
//           }),
//         ),
//     );
//   }

//   if (adminLevel === "SUB_GROUP") {
//     const {
//       allocationGroup: { displayName: groupName },
//       displayName: subGroupName,
//       allocationInstances,
//     } = await ctx.db.allocationSubGroup.findFirstOrThrow({
//       where: { allocationGroupId: group!, id: subGroup! },
//       select: {
//         allocationGroup: { select: { displayName: true } },
//         displayName: true,
//         allocationInstances: {
//           select: {
//             displayName: true,
//             allocationGroupId: true,
//             allocationSubGroupId: true,
//             id: true,
//           },
//         },
//       },
//     });
//     return allocationInstances.map(
//       ({ allocationGroupId, allocationSubGroupId, id, displayName }) => ({
//         group: {
//           id: allocationGroupId,
//           displayName: groupName,
//         },
//         subGroup: {
//           id: allocationSubGroupId,
//           displayName: subGroupName,
//         },
//         instance: {
//           id,
//           displayName,
//         },
//       }),
//     );
//   }
// }

// const res = await ctx.db.userInInstance.findMany({
//   where: { userId: user.id },
//   select: {
//     allocationGroupId: true,
//     allocationSubGroupId: true,
//     allocationInstanceId: true,
//     // TODO: fix broken relation
//     // allocationInstance: {
//     //   select: {
//     //     displayName: true,
//     //     allocationSubGroup: {
//     //       select: {
//     //         displayName: true,
//     //         allocationGroup: { select: { displayName: true } },
//     //       },
//     //     },
//     //   },
//     // },
//   },
//   });

//   const data: {
//     allocationGroupId: string;
//     allocationSubGroupId: string;
//     id: string;
//     allocationSubGroup: {
//       allocationGroup: {
//         displayName: string;
//       };
//       displayName: string;
//     };
//     displayName: string;
//   }[] = [];

//   for (const item of res) {
//     const temp = await ctx.db.allocationInstance.findFirstOrThrow({
//       where: {
//         allocationGroupId: item.allocationGroupId,
//         allocationSubGroupId: item.allocationSubGroupId,
//         id: item.allocationInstanceId,
//       },
//       select: {
//         displayName: true,
//         id: true,
//         allocationSubGroupId: true,
//         allocationGroupId: true,
//         allocationSubGroup: {
//           select: {
//             displayName: true,
//             allocationGroup: {
//               select: {
//                 displayName: true,
//               },
//             },
//           },
//         },
//       },
//     });
//     data.push(temp);
//   }

//   return data.map(
//     ({
//       allocationGroupId,
//       allocationSubGroupId,
//       id,
//       displayName,
//       allocationSubGroup: {
//         displayName: subGroupName,
//         allocationGroup: { displayName: groupName },
//       },
//     }) => ({
//       group: {
//         id: allocationGroupId,
//         displayName: groupName,
//       },
//       subGroup: {
//         id: allocationSubGroupId,
//         displayName: subGroupName,
//       },
//       instance: {
//         id,
//         displayName,
//       },
//     }),
//   );
// }),
// });
