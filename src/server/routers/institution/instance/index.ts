import { Role, Stage } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { setDiff } from "@/lib/utils/general/set-difference";
import {
  newStudentSchema,
  newSupervisorSchema,
} from "@/lib/validations/add-users/new-user";
import {
  adminPanelTabs,
  adminPanelTabsByStage,
} from "@/lib/validations/admin-panel-tabs";
import {
  allocationByProjectDtoSchema,
  allocationByStudentDtoSchema,
  allocationBySupervisorDtoSchema,
} from "@/lib/validations/allocation/data-table-dto";
import {
  forkedInstanceSchema,
  updatedInstanceSchema,
} from "@/lib/validations/instance-form";
import { instanceTabs } from "@/lib/validations/instance-tabs";
import { instanceParamsSchema } from "@/lib/validations/params";
import { studentStages, supervisorStages } from "@/lib/validations/stage";
import { studentLevelSchema } from "@/lib/validations/student-level";

import {
  createTRPCRouter,
  instanceAdminProcedure,
  instanceProcedure,
  protectedProcedure,
  roleAwareProcedure,
} from "@/server/trpc";
import { adminAccess } from "@/server/utils/admin-access";
import { getInstance } from "@/server/utils/get-instance";
import { validateEmailGUIDMatch } from "@/server/utils/id-email-check";
import { isSuperAdmin } from "@/server/utils/is-super-admin";
import { getUserRole } from "@/server/utils/user-role";

import { addStudentsTx } from "./_utils/add-students-transaction";
import { addSupervisorsTx } from "./_utils/add-supervisors-transaction";
import { getAllocationData } from "./_utils/allocation-data";
import { forkInstanceTransaction } from "./_utils/fork";
import { mergeInstanceTransaction } from "./_utils/merge";
import { algorithmRouter } from "./algorithm";
import { externalSystemRouter } from "./external";
import { matchingRouter } from "./matching";
import { projectRouter } from "./project";

// TODO: add stage checks to stage-specific procedures
export const instanceRouter = createTRPCRouter({
  matching: matchingRouter,
  algorithm: algorithmRouter,
  project: projectRouter,
  external: externalSystemRouter,

  exists: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        return await ctx.db.allocationInstance.findFirst({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            id: instance,
          },
        });
      },
    ),

  get: protectedProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx, input: { params } }) => getInstance(ctx.db, params)),

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

  projectAllocations: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .output(
      z.object({
        byStudent: z.array(allocationByStudentDtoSchema),
        byProject: z.array(allocationByProjectDtoSchema),
        bySupervisor: z.array(allocationBySupervisorDtoSchema),
      }),
    )
    .query(async ({ ctx, input: { params } }) => {
      const allocationData = await getAllocationData(ctx.db, params);

      const byStudent = allocationData.map((allocation) => ({
        student: {
          id: allocation.student.user.id,
          name: allocation.student.user.name!,
          email: allocation.student.user.email!,
          ranking: allocation.studentRanking,
        },
        project: {
          id: allocation.project.id,
        },
        supervisor: {
          id: allocation.project.supervisor.user.id,
          name: allocation.project.supervisor.user.name!,
        },
      }));

      const byProject = allocationData.map((allocation) => ({
        project: {
          id: allocation.project.id,
          title: allocation.project.title,
          capacityLowerBound: allocation.project.capacityLowerBound,
          capacityUpperBound: allocation.project.capacityUpperBound,
        },
        supervisor: {
          id: allocation.project.supervisor.user.id,
          name: allocation.project.supervisor.user.name!,
        },
        student: {
          id: allocation.student.user.id,
          ranking: allocation.studentRanking,
        },
      }));

      const bySupervisor = allocationData.map((allocation) => ({
        project: {
          id: allocation.project.id,
          title: allocation.project.title,
        },
        supervisor: {
          id: allocation.project.supervisor.user.id,
          name: allocation.project.supervisor.user.name!,
          email: allocation.project.supervisor.user.email!,
          allocationLowerBound:
            allocation.project.supervisor.supervisorInstanceDetails[0]
              .projectAllocationLowerBound,
          allocationTarget:
            allocation.project.supervisor.supervisorInstanceDetails[0]
              .projectAllocationTarget,
          allocationUpperBound:
            allocation.project.supervisor.supervisorInstanceDetails[0]
              .projectAllocationUpperBound,
        },
        student: {
          id: allocation.student.user.id,
          ranking: allocation.studentRanking,
        },
      }));

      return { byStudent, byProject, bySupervisor };
    }),

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
        const studentData = await ctx.db.studentDetails.findMany({
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

        return studentData.map(
          ({ userInInstance: { user }, studentLevel }) => ({
            id: user.id,
            name: user.name!,
            email: user.email!,
            level: studentLevel,
          }),
        );
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
          const exists = await tx.supervisorInstanceDetails.findFirst({
            where: {
              userId: institutionId,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            },
          });
          if (exists) throw new TRPCClientError("User is already a supervisor");

          await validateEmailGUIDMatch(tx, institutionId, email, fullName);

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
    .mutation(async ({ ctx, input: { params, newSupervisors } }) => {
      return await addSupervisorsTx(ctx.db, newSupervisors, params);
    }),

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
        await ctx.db.userInInstance.deleteMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: { in: supervisorIds },
          },
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
          level: studentLevelSchema.parse(studentLevel),
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
          const exists = await tx.studentDetails.findFirst({
            where: {
              userId: institutionId,
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
            },
          });
          if (exists) throw new TRPCClientError("User is already a student");

          await validateEmailGUIDMatch(tx, institutionId, email, fullName);

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
    .mutation(async ({ ctx, input: { params, newStudents } }) => {
      return await addStudentsTx(ctx.db, newStudents, params);
    }),

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
        await ctx.db.userInInstance.delete({
          where: {
            instanceMembership: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              userId: studentId,
            },
          },
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
        await ctx.db.userInInstance.deleteMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
            userId: { in: studentIds },
          },
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
        await ctx.db.$transaction(async (tx) => {
          await tx.allocationInstance.update({
            where: {
              instanceId: {
                allocationGroupId: group,
                allocationSubGroupId: subGroup,
                id: instance,
              },
            },
            data: updatedData,
          });

          const currentInstanceFlags = await tx.flag.findMany({
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

          await tx.flag.deleteMany({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              title: { in: staleInstanceFlags.map((f) => f.title) },
            },
          });

          await tx.flag.createMany({
            data: newInstanceFlags.map((f) => ({
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              title: f.title,
            })),
          });

          const currentInstanceTags = await tx.tag.findMany({
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

          await tx.tag.deleteMany({
            where: {
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              title: { in: staleInstanceTags.map((t) => t.title) },
            },
          });

          await tx.tag.createMany({
            data: newInstanceTags.map((t) => ({
              allocationGroupId: group,
              allocationSubGroupId: subGroup,
              allocationInstanceId: instance,
              title: t.title,
            })),
          });
        });
      },
    ),

  getHeaderTabs: protectedProcedure
    .input(z.object({ params: instanceParamsSchema.partial() }))
    .query(async ({ ctx, input }) => {
      const result = instanceParamsSchema.safeParse(input.params);
      if (!result.success) return { headerTabs: [], instancePath: "" };

      const params = result.data;

      const instance = await getInstance(ctx.db, params);
      const role = await getUserRole(ctx.db, ctx.session.user, params);
      const instancePath = formatParamsAsPath(params);

      const adminTabs = [instanceTabs.allSupervisors, instanceTabs.allStudents];

      if (role !== Role.ADMIN) {
        return {
          headerTabs: [instanceTabs.instanceHome, instanceTabs.allProjects],
          instancePath,
        };
      }

      const headerTabs =
        instance.stage === Stage.SETUP
          ? [instanceTabs.instanceHome, ...adminTabs]
          : [instanceTabs.instanceHome, instanceTabs.allProjects, ...adminTabs];

      return { headerTabs, instancePath };
    }),

  adminPanelTabs: instanceAdminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx }) => {
      const parentInstanceId = ctx.instance.parentInstanceId;
      const stage = ctx.instance.stage;

      if (stage === Stage.ALLOCATION_PUBLICATION) {
        const base = [
          adminPanelTabs.allocationOverview,
          adminPanelTabs.exportToCSV,
          // adminPanelTabs.exportToExternalSystem,
        ];
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

  getFlags: instanceProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .query(async ({ ctx, input: { params } }) => {
      const flags = await ctx.db.flag.findMany({
        where: {
          allocationGroupId: params.group,
          allocationSubGroupId: params.subGroup,
          allocationInstanceId: params.instance,
        },
        select: { title: true },
      });

      return flags.map(({ title }) => title);
    }),
});
