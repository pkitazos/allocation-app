import { Role, Stage } from "@prisma/client";
import { z } from "zod";

import { stageOrd } from "@/lib/db";
import {
  relativeComplement,
  setDiff,
} from "@/lib/utils/general/set-difference";
import {
  adminPanelTabs,
  adminPanelTabsByStage,
} from "@/lib/validations/admin-panel-tabs";
import {
  newStudentSchema,
  newSupervisorSchema,
} from "@/lib/validations/add-users/new-user";
import {
  forkedInstanceSchema,
  updatedInstanceSchema,
} from "@/lib/validations/instance-form";
import { instanceTabs } from "@/lib/validations/instance-tabs";
import { instanceParamsSchema } from "@/lib/validations/params";
import { studentStages, supervisorStages } from "@/lib/validations/stage";

import {
  adminProcedure,
  createTRPCRouter,
  forkedInstanceProcedure,
  protectedProcedure,
  stageAwareProcedure,
} from "@/server/trpc";
import { adminAccess } from "@/server/utils/admin-access";
import { isSuperAdmin } from "@/server/utils/is-super-admin";
import { getUserRole } from "@/server/utils/user-role";

import { forkInstanceTransaction } from "./_utils/fork";
import { mergeInstanceTransaction } from "./_utils/merge";
import { algorithmRouter } from "./algorithm";
import { matchingRouter } from "./matching";
import { projectRouter } from "./project";
import { X } from "lucide-react";

export const instanceRouter = createTRPCRouter({
  matching: matchingRouter,
  algorithm: algorithmRouter,
  project: projectRouter,

  get: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        return await ctx.db.allocationInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            id: instance,
          },
        });
      },
    ),

  access: stageAwareProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx, input: { params } }) => {
      const user = ctx.session.user;

      const superAdmin = await isSuperAdmin(ctx.db, user.id);
      if (superAdmin) return true;

      const adminInSpace = await adminAccess(ctx.db, user.id, params);
      if (adminInSpace) return true;

      const stage = ctx.stage;
      const { group, subGroup, instance } = params;

      const { role } = await ctx.db.userInInstance.findFirstOrThrow({
        where: {
          allocationGroupId: group,
          allocationSubGroupId: subGroup,
          allocationInstanceId: instance,
          userId: user.id,
        },
        select: { role: true },
      });

      if (role === Role.SUPERVISOR) return !supervisorStages.includes(stage);

      if (role === Role.STUDENT) return !studentStages.includes(stage);

      return true;
    }),

  currentStage: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const { stage } = await ctx.db.allocationInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            id: instance,
          },
          select: {
            stage: true,
          },
        });
        return stage;
      },
    ),

  setStage: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        stage: z.nativeEnum(Stage),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          stage,
        },
      }) => {
        const supervisorsCanAccess = stageOrd[stage] >= 2;
        const studentsCanAccess = stageOrd[stage] >= 3;

        await ctx.db.allocationInstance.update({
          where: {
            instanceId: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
          },
          data: {
            stage,
            supervisorsCanAccess,
            studentsCanAccess,
          },
        });
      },
    ),

  selectedAlgName: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const { selectedAlgName } =
          await ctx.db.allocationInstance.findFirstOrThrow({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
            select: { selectedAlgName: true },
          });

        return selectedAlgName ?? undefined;
      },
    ),

  projectAllocations: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const byStudent = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          // ! currently selects all users not just students
          select: {
            student: {
              select: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
            project: {
              select: {
                id: true,
                supervisor: {
                  select: { user: { select: { id: true, name: true } } },
                },
              },
            },
            studentRanking: true,
          },
        });

        const byProject = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            project: {
              select: {
                id: true,
                title: true,
                capacityLowerBound: true,
                capacityUpperBound: true,
                supervisor: {
                  select: { user: { select: { id: true, name: true } } },
                },
              },
            },
            userId: true,
            studentRanking: true,
          },
        });

        const bySupervisor = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            project: {
              select: {
                id: true,
                title: true,
                supervisor: {
                  select: {
                    user: { select: { id: true, name: true, email: true } },
                    supervisorInstanceDetails: {
                      where: {
                        allocationGroupId: group,
                        allocationSubGroupId: subGroup,
                        allocationInstanceId: instance,
                      },
                      select: {
                        projectAllocationLowerBound: true,
                        projectAllocationTarget: true,
                        projectAllocationUpperBound: true,
                      },
                      take: 1, // * does not do anything
                    },
                  },
                },
              },
            },
            userId: true,
            studentRanking: true,
          },
        });

        return { byStudent, byProject, bySupervisor };
      },
    ),

  getEditFormDetails: stageAwareProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const data = await ctx.db.allocationInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            id: instance,
          },
          include: { flags: true, tags: true },
        });

        return {
          ...data,
          instanceName: data.displayName,
          minNumPreferences: data.minPreferences,
          maxNumPreferences: data.maxPreferences,
          maxNumPerSupervisor: data.maxPreferencesPerSupervisor,
        };
      },
    ),

  supervisors: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const supervisors = await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.SUPERVISOR,
          },
          select: {
            user: { select: { id: true, name: true, email: true } },
          },
        });

        return supervisors.map(({ user }) => ({
          id: user.id,
          name: user.name!,
          email: user.email!,
        }));
      },
    ),

  students: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const studentData = await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.STUDENT,
          },
          select: {
            user: { select: { id: true, name: true, email: true } },
          },
        });

        return studentData.map(({ user }) => ({
          id: user.id,
          name: user.name!,
          email: user.email!,
        }));
      },
    ),

  addSupervisorDetails: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        newSupervisors: z.array(newSupervisorSchema),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          newSupervisors: addedSupervisors,
        },
      }) => {
        const currentSupervisors = await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.SUPERVISOR,
          },
          select: { user: { select: { id: true } } },
        });

        const supervisorIds = currentSupervisors.map(({ user }) => user.id);
        const newSupervisors = addedSupervisors.filter((s) => {
          return !supervisorIds.includes(s.institutionId);
        });

        await ctx.db.user.createMany({
          data: newSupervisors.map((e) => ({
            id: e.institutionId,
            name: e.fullName,
            email: e.email,
          })),
        });

        await ctx.db.userInInstance.createMany({
          data: newSupervisors.map(({ institutionId }) => ({
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: institutionId,
            role: Role.SUPERVISOR,
          })),
        });

        await ctx.db.supervisorInstanceDetails.createMany({
          data: newSupervisors.map((e) => ({
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: e.institutionId,
            projectAllocationLowerBound: 0,
            projectAllocationTarget: e.projectTarget,
            projectAllocationUpperBound: e.projectUpperQuota,
          })),
          skipDuplicates: true,
        });
      },
    ),

  invitedSupervisors: stageAwareProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const invitedUsers = await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.SUPERVISOR,
          },
          select: { user: true, joined: true },
        });

        const { supervisorsCanAccess: platformAccess } =
          await ctx.db.allocationInstance.findFirstOrThrow({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
            select: { supervisorsCanAccess: true },
          });

        const supervisors = invitedUsers.map(({ user, joined }) => ({
          id: user.id,
          name: user.name!,
          email: user.email!,
          joined,
        }));

        return { supervisors, platformAccess };
      },
    ),

  addStudentDetails: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        newStudents: z.array(newStudentSchema),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          newStudents: addedStudents,
        },
      }) => {
        const currentStudents = await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.STUDENT,
          },
          select: { user: { select: { id: true } } },
        });

        const studentIds = currentStudents.map(({ user }) => user.id);
        const newStudents = addedStudents.filter((s) => {
          return !studentIds.includes(s.institutionId);
        });

        await ctx.db.user.createMany({
          data: newStudents.map((e) => ({
            id: e.institutionId,
            name: e.fullName,
            email: e.email,
          })),
        });

        await ctx.db.userInInstance.createMany({
          data: newStudents.map(({ institutionId }) => ({
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: institutionId,
            role: Role.STUDENT,
          })),
        });
      },
    ),

  getStudents: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const students = await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.STUDENT,
          },
          select: { user: true },
        });

        return students.map(({ user }) => ({
          institutionId: user.id,
          fullName: user.name!,
          email: user.email!,
          level: 0,
        }));
      },
    ),

  addStudent: adminProcedure
    .input(
      z.object({ params: instanceParamsSchema, newStudent: newStudentSchema }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          newStudent: { institutionId, fullName, email, level },
        },
      }) => {
        await ctx.db.$transaction(async (tx) => {
          const user = await tx.user.findFirst({
            where: { id: institutionId },
          });

          if (!user) {
            // TODO: Change what gets added to user table after auth is implemented
            await tx.user.create({
              data: {
                id: institutionId,
                name: fullName,
                email,
              },
            });
          }

          await tx.userInInstance.create({
            data: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              role: Role.STUDENT,
              userId: institutionId,
            },
          });

          // await ctx.db.studentInstanceDetails.create({data:{
          // studentLevel:level
          // }});
        });
        return { institutionId, fullName, email, level };
      },
    ),

  addStudents: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        newStudents: z.array(newStudentSchema),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          newStudents,
        },
      }) => {
        await ctx.db.$transaction(async (tx) => {
          const users = await tx.user.findMany({
            where: { id: { in: newStudents.map((s) => s.institutionId) } },
          });

          const newUsers = relativeComplement(
            newStudents,
            users,
            (a, b) => a.institutionId === b.id,
          );

          if (newUsers.length > 0) {
            // TODO: Change what gets added to user table after auth is implemented
            await tx.user.createMany({
              data: newUsers.map((e) => ({
                id: e.institutionId,
                name: e.fullName,
                email: e.email,
              })),
            });
          }

          await tx.userInInstance.createMany({
            data: newStudents.map(({ institutionId }) => ({
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              role: Role.STUDENT,
              userId: institutionId,
            })),
            skipDuplicates: true,
          });

          // await ctx.db.studentInstanceDetails.createMany({
          // data:newStudents.map(({level})=>{studentLevel:level})
          // });
        });
      },
    ),

  removeStudent: adminProcedure
    .input(z.object({ params: instanceParamsSchema, studentId: z.string() }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          studentId,
        },
      }) => {
        await ctx.db.$transaction(async (tx) => {
          await tx.userInInstance.delete({
            where: {
              instanceMembership: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
                userId: studentId,
              },
            },
          });

          // await tx.studentInstanceDetails.delete({
          //   where: {
          //     detailsId: {
          //       allocationGroupId: group,
          //       allocationSubGroupId: subGroup,
          //       allocationInstanceId: instance,
          //       userId: studentId,
          //     }
          //   }
          // })
        });
      },
    ),

  removeStudents: adminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        studentIds: z.array(z.string()),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          studentIds,
        },
      }) => {
        await ctx.db.$transaction(async (tx) => {
          await tx.userInInstance.deleteMany({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: { in: studentIds },
            },
          });

          // await tx.studentInstanceDetails.deleteMany({
          //   where: {
          //     allocationGroupId: group,
          //     allocationSubGroupId: subGroup,
          //     allocationInstanceId: instance,
          //     userId: { in: studentIds },
          //   },
          // });
        });
      },
    ),

  invitedStudents: stageAwareProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const invitedUsers = await ctx.db.userInInstance.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            role: Role.STUDENT,
          },
          select: { user: true, joined: true },
        });

        const { studentsCanAccess: platformAccess } =
          await ctx.db.allocationInstance.findFirstOrThrow({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
            select: { studentsCanAccess: true },
          });

        const students = invitedUsers.map(({ user, joined }) => ({
          id: user.id,
          name: user.name!,
          email: user.email!,
          joined,
        }));

        return { students, platformAccess };
      },
    ),

  edit: stageAwareProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        updatedInstance: updatedInstanceSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          updatedInstance: { flags, tags, ...updatedData },
        },
      }) => {
        await ctx.db.allocationInstance.update({
          where: {
            instanceId: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
          },
          data: updatedData,
        });

        const currentInstanceFlags = await ctx.db.flag.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
        });

        const newInstanceFlags = setDiff(
          flags,
          currentInstanceFlags,
          (a) => a.title,
        );
        const staleInstanceFlags = setDiff(
          currentInstanceFlags,
          flags,
          (a) => a.title,
        );

        await ctx.db.flag.deleteMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            title: { in: staleInstanceFlags.map((f) => f.title) },
          },
        });

        await ctx.db.flag.createMany({
          data: newInstanceFlags.map((f) => ({
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            title: f.title,
          })),
        });

        const currentInstanceTags = await ctx.db.tag.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
        });

        const newInstanceTags = setDiff(
          tags,
          currentInstanceTags,
          (a) => a.title,
        );
        const staleInstanceTags = setDiff(
          currentInstanceTags,
          tags,
          (a) => a.title,
        );

        await ctx.db.tag.deleteMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            title: { in: staleInstanceTags.map((t) => t.title) },
          },
        });

        await ctx.db.tag.createMany({
          data: newInstanceTags.map((t) => ({
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            title: t.title,
          })),
        });
      },
    ),

  headerTabs: stageAwareProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx, input: { params } }) => {
      const stage = ctx.stage;
      const role = await getUserRole(ctx.db, ctx.session.user, params);

      const adminTabs = [instanceTabs.supervisors, instanceTabs.students];

      if (role === Role.ADMIN)
        return stage === Stage.SETUP
          ? [instanceTabs.instanceHome, ...adminTabs]
          : [instanceTabs.instanceHome, instanceTabs.allProjects, ...adminTabs];

      return [instanceTabs.instanceHome, instanceTabs.allProjects];
    }),

  adminPanelTabs: forkedInstanceProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const parentInstanceId = ctx.parentInstanceId;
        const { stage } = await ctx.db.allocationInstance.findFirstOrThrow({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            id: instance,
          },
          select: { stage: true },
        });

        if (stage === Stage.ALLOCATION_PUBLICATION) {
          const base = [adminPanelTabs.allocationOverview];
          return !parentInstanceId
            ? [...base, adminPanelTabs.forkInstance]
            : [...base, adminPanelTabs.mergeInstance];
        }

        return adminPanelTabsByStage[stage];
      },
    ),

  fork: stageAwareProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        newInstance: forkedInstanceSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          newInstance: forked,
        },
      }) => {
        const params = { group, subGroup, instance };
        if (ctx.stage !== Stage.ALLOCATION_PUBLICATION) return;

        await forkInstanceTransaction(ctx.db, forked, params);
      },
    ),

  merge: forkedInstanceProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const parentInstanceId = ctx.parentInstanceId;
        if (!parentInstanceId) return;

        await mergeInstanceTransaction(ctx.db, parentInstanceId, {
          group,
          subGroup,
          instance,
        });
      },
    ),
});
