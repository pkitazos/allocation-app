import { z } from "zod";

export type ProjectDetails = {
  capacityLowerBound: number;
  capacityUpperBound: number;
  allocatedTo: string[];
  supervisor: {
    supervisorInstanceDetails: {
      projectAllocationLowerBound: number;
      projectAllocationTarget: number;
      projectAllocationUpperBound: number;
    }[];
  };
};

export type MatchingInfo = {
  profile: number[];
  weight: number;
  isValid: boolean;
  rowValidities: boolean[];
};

export const studentRowSchema = z.object({
  student: z.object({
    id: z.string(),
    name: z.string(),
  }),
  projects: z.array(
    z.object({
      id: z.string(),
      selected: z.boolean(),
    }),
  ),
});

export type StudentRow = z.infer<typeof studentRowSchema>;

export const projectInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  capacityLowerBound: z.number(),
  capacityUpperBound: z.number(),
  allocatedTo: z.array(z.string()),
  projectAllocationLowerBound: z.number(),
  projectAllocationTarget: z.number(),
  projectAllocationUpperBound: z.number(),
});

export type ProjectInfo = z.infer<typeof projectInfoSchema>;

export type RowProject = {
  id: string;
  selected: boolean;
};

export type SupervisorAllocationData = {
  userInInstance: {
    supervisorProjects: {
      id: string;
      allocations: {
        userId: string;
      }[];
    }[];
  };
  userId: string;
  projectAllocationLowerBound: number;
  projectAllocationTarget: number;
  projectAllocationUpperBound: number;
};

export type SupervisorDetails = {
  supervisorId: string;
  lowerBound: number;
  target: number;
  upperBound: number;
  projects: string[];
};
