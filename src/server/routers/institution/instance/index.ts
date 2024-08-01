import { Role, Stage } from "@prisma/client";
import { z } from "zod";

import {
  relativeComplement,
  setDiff,
} from "@/lib/utils/general/set-difference";
import {
  newStudentSchema,
  newSupervisorSchema,
} from "@/lib/validations/add-users/new-user";
import {
  adminPanelTabs,
  adminPanelTabsByStage,
} from "@/lib/validations/admin-panel-tabs";
import {
  forkedInstanceSchema,
  updatedInstanceSchema,
} from "@/lib/validations/instance-form";
import { instanceTabs } from "@/lib/validations/instance-tabs";
import { instanceParamsSchema } from "@/lib/validations/params";
import { studentStages, supervisorStages } from "@/lib/validations/stage";

import {
  createTRPCRouter,
  instanceAdminProcedure,
  instanceProcedure,
  protectedProcedure,
  roleAwareProcedure,
} from "@/server/trpc";
import { adminAccess } from "@/server/utils/admin-access";
import { isSuperAdmin } from "@/server/utils/is-super-admin";

import { forkInstanceTransaction } from "./_utils/fork";
import { mergeInstanceTransaction } from "./_utils/merge";
import { algorithmRouter } from "./algorithm";
import { matchingRouter } from "./matching";
import { projectRouter } from "./project";

// TODO: add stage checks to stage-specific procedures

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

  // TODO: refactor as it potentially doesn't need the adminAccess function
  access: roleAwareProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx, input: { params } }) => {
      const user = ctx.session.user;
      const stage = ctx.instance.stage;

      const superAdmin = await isSuperAdmin(ctx.db, user.id);
      if (superAdmin) return true;

      const adminInSpace = await adminAccess(ctx.db, user.id, params);
      if (adminInSpace) return true;

      if (user.role === Role.SUPERVISOR) {
        return !supervisorStages.includes(stage);
      }

      if (user.role === Role.STUDENT) {
        return !studentStages.includes(stage);
      }

      // TODO: throw error instead of returning
      return true;
    }),

  currentStage: instanceProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx }) => ctx.instance.stage),

  setStage: instanceAdminProcedure
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
        await ctx.db.allocationInstance.update({
          where: {
            instanceId: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              id: instance,
            },
          },
          data: { stage },
        });
      },
    ),

  selectedAlgName: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx }) => ctx.instance.selectedAlgName ?? undefined),

  // TODO: refactor
  projectAllocations: instanceAdminProcedure
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

  getEditFormDetails: instanceAdminProcedure
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

  supervisors: instanceProcedure
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

  students: instanceProcedure
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

  addSupervisorDetails: instanceAdminProcedure
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

  getSupervisors: instanceAdminProcedure
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
            user: true,
            supervisorInstanceDetails: {
              where: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
              },
            },
          },
        });

        return supervisors.map(({ user, supervisorInstanceDetails }) => ({
          institutionId: user.id,
          fullName: user.name!,
          email: user.email!,
          projectTarget: supervisorInstanceDetails[0].projectAllocationTarget,
          projectUpperQuota:
            supervisorInstanceDetails[0].projectAllocationUpperBound,
        }));
      },
    ),

  addSupervisor: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        newSupervisor: newSupervisorSchema,
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          newSupervisor: {
            institutionId,
            fullName,
            email,
            projectTarget,
            projectUpperQuota,
          },
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
              role: Role.SUPERVISOR,
              userId: institutionId,
            },
          });

          await tx.supervisorInstanceDetails.create({
            data: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: institutionId,
              projectAllocationLowerBound: 0,
              projectAllocationTarget: projectTarget,
              projectAllocationUpperBound: projectUpperQuota,
            },
          });
        });

        return {
          institutionId,
          fullName,
          email,
          projectTarget,
          projectUpperQuota,
        };
      },
    ),

  addSupervisors: instanceAdminProcedure
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
          newSupervisors,
        },
      }) => {
        await ctx.db.$transaction(async (tx) => {
          const users = await tx.user.findMany({
            where: { id: { in: newSupervisors.map((s) => s.institutionId) } },
          });

          const newUsers = relativeComplement(
            newSupervisors,
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
            data: newSupervisors.map(({ institutionId }) => ({
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              role: Role.SUPERVISOR,
              userId: institutionId,
            })),
            skipDuplicates: true,
          });

          await tx.supervisorInstanceDetails.createMany({
            data: newSupervisors.map(
              ({ institutionId, projectTarget, projectUpperQuota }) => ({
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
                userId: institutionId,
                projectAllocationLowerBound: 0,
                projectAllocationTarget: projectTarget,
                projectAllocationUpperBound: projectUpperQuota,
              }),
            ),
            skipDuplicates: true,
          });
        });
      },
    ),

  removeSupervisor: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema, supervisorId: z.string() }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          supervisorId,
        },
      }) => {
        await ctx.db.$transaction(async (tx) => {
          await tx.userInInstance.delete({
            where: {
              instanceMembership: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                allocationInstanceId: instance,
                userId: supervisorId,
              },
            },
          });
        });
      },
    ),

  removeSupervisors: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        supervisorIds: z.array(z.string()),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
          supervisorIds,
        },
      }) => {
        await ctx.db.$transaction(async (tx) => {
          await tx.userInInstance.deleteMany({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: { in: supervisorIds },
            },
          });
        });
      },
    ),

  invitedSupervisors: instanceAdminProcedure
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

        return {
          supervisors: invitedUsers.map(({ user, joined }) => ({
            id: user.id,
            name: user.name!,
            email: user.email!,
            joined,
          })),
        };
      },
    ),

  addStudentDetails: instanceAdminProcedure
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

  getStudents: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const students = await ctx.db.studentDetails.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: {
            userInInstance: { select: { user: true } },
            studentLevel: true,
          },
        });

        return students.map(({ userInInstance: { user }, studentLevel }) => ({
          institutionId: user.id,
          fullName: user.name!,
          email: user.email!,
          level: studentLevel,
        }));
      },
    ),

  addStudent: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        newStudent: newStudentSchema,
      }),
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

          await tx.studentDetails.create({
            data: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: institutionId,
              studentLevel: level,
              submittedPreferences: false,
            },
          });
        });
        return { institutionId, fullName, email, level };
      },
    ),

  addStudents: instanceAdminProcedure
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

          await tx.studentDetails.createMany({
            data: newStudents.map(({ level, institutionId }) => ({
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: institutionId,
              studentLevel: level,
              submittedPreferences: false,
            })),
          });
        });
      },
    ),

  removeStudent: instanceAdminProcedure
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
        });
      },
    ),

  removeStudents: instanceAdminProcedure
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
        });
      },
    ),

  invitedStudents: instanceAdminProcedure
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

        return {
          students: invitedUsers.map(({ user, joined }) => ({
            id: user.id,
            name: user.name!,
            email: user.email!,
            joined,
          })),
        };
      },
    ),

  edit: instanceAdminProcedure
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

  headerTabs: roleAwareProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx }) => {
      const stage = ctx.instance.stage;
      const role = ctx.session.user.role;

      const adminTabs = [instanceTabs.supervisors, instanceTabs.students];

      if (role === Role.ADMIN)
        return stage === Stage.SETUP
          ? [instanceTabs.instanceHome, ...adminTabs]
          : [instanceTabs.instanceHome, instanceTabs.allProjects, ...adminTabs];

      return [instanceTabs.instanceHome, instanceTabs.allProjects];
    }),

  adminPanelTabs: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx }) => {
      const parentInstanceId = ctx.instance.parentInstanceId;
      const stage = ctx.instance.stage;

      if (stage === Stage.ALLOCATION_PUBLICATION) {
        const base = [adminPanelTabs.allocationOverview];
        return !parentInstanceId
          ? [...base, adminPanelTabs.forkInstance]
          : [...base, adminPanelTabs.mergeInstance];
      }

      return adminPanelTabsByStage[stage];
    }),

  fork: instanceAdminProcedure
    .input(
      z.object({
        params: instanceParamsSchema,
        newInstance: forkedInstanceSchema,
      }),
    )
    .mutation(async ({ ctx, input: { params, newInstance: forked } }) => {
      if (ctx.instance.stage !== Stage.ALLOCATION_PUBLICATION) {
        // TODO: throw error instead of returning
        return;
      }
      await forkInstanceTransaction(ctx.db, forked, params);
    }),

  merge: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(async ({ ctx, input: { params } }) => {
      const parentInstanceId = ctx.instance.parentInstanceId;
      if (!parentInstanceId) {
        // TODO: throw error instead of returning
        return;
      }
      await mergeInstanceTransaction(ctx.db, parentInstanceId, params);
    }),
});
