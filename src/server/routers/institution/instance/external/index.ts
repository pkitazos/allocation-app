/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";

import { mock } from "@/lib/utils/general/delay";
import { instanceParamsSchema } from "@/lib/validations/params";

import { adminProcedure, createTRPCRouter } from "@/server/trpc";

export const externalSystemRouter = createTRPCRouter({
  checkStudents: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const allocationData = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { userId: true },
        });

        const studentData = allocationData.map((s) => ({
          guid: s.userId,
        }));

        // TODO: uncomment once endpoint interface is confirmed
        // const result = await axios
        //   .post("/sp_checkStudents", studentData)
        //   .then((res) => studentCheckResponseSchema.safeParse(res.data));

        // if (!result.success) {
        //   throw new TRPCClientError("Result does not match expected type");
        // }

        // const checkedStudents = result.data;

        // TODO: remove this once endpoint interface is confirmed
        const checkedStudents = await mock([
          { guid: "123", exists: 1 as const },
          { guid: "456", exists: 1 as const },
          { guid: "789", exists: 0 as const },
        ]);

        return {
          checkedStudents,
          total: checkedStudents.length,
          exist: checkedStudents.reduce((acc, val) => acc + val.exists, 0),
        };
      },
    ),

  checkSupervisors: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const allocationData = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { project: { select: { supervisorId: true } } },
        });

        const supervisorData = [
          ...new Set(allocationData.map((s) => s.project.supervisorId)),
        ].map((id) => ({ guid: id }));

        // TODO: uncomment once endpoint interface is confirmed
        // const result = await axios
        //   .post("/sp_checkSupervisors", supervisorData)
        //   .then((res) => supervisorCheckResponseSchema.safeParse(res.data));

        // if (!result.success) {
        //   throw new TRPCClientError("Result does not match expected type");
        // }

        // const checkedSupervisors = result.data;

        // TODO: remove this once endpoint interface is confirmed
        const checkedSupervisors = await mock([
          { guid: "123", exists: 1 as const },
          { guid: "456", exists: 1 as const },
          { guid: "789", exists: 0 as const },
        ]);

        return {
          checkedSupervisors,
          total: checkedSupervisors.length,
          exist: checkedSupervisors.reduce((acc, val) => acc + val.exists, 0),
        };
      },
    ),

  createProjects: adminProcedure
    .input(z.object({ params: instanceParamsSchema }))
    .mutation(
      async ({
        ctx,
        input: {
          params: { group, subGroup, instance },
        },
      }) => {
        const allocationData = await ctx.db.projectAllocation.findMany({
          where: {
            allocationGroupId: group,
            allocationSubGroupId: subGroup,
            allocationInstanceId: instance,
          },
          select: { project: true, student: true },
        });

        const projectData = allocationData.map((e) => ({
          project_id: e.project.id,
          student_id: e.student.userId,
          // TODO: add appropriate fields once endpoint interface is confirmed
        }));

        // TODO: uncomment once endpoint interface is confirmed
        // const result = await axios
        //   .post("/sp_createProjects", allocationData)
        //   .then((res) => projectCreationResponseSchema.safeParse(res.data));

        // if (!result.success) {
        //   throw new TRPCClientError("Result does not match expected type");
        // }
        // const createdProjects = result.data.map((e) => ({
        //   id: e.id,
        //   created: e.created_successfully,
        // }));

        // TODO: remove this once endpoint interface is confirmed
        const createdProjects = await mock([
          { id: "123", created: 1 as const },
          { id: "456", created: 1 as const },
        ]);

        return {
          createdProjects,
          total: createdProjects.length,
          created: createdProjects.reduce((acc, val) => acc + val.created, 0),
        };
      },
    ),
});
