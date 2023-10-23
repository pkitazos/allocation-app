"use client";
import { Button } from "@/components/ui/button";
import {
  AllocationGroupModel,
  AllocationInstanceModel,
  AllocationSubGroupModel,
  FlagModel,
  GroupAdminModel,
  ProjectModel,
  StudentModel,
  SuperAdminModel,
  SupervisorModel,
  TagModel,
} from "@/types/zod";
import { useState } from "react";
import { z } from "zod";

export default function Page() {
  const [inProgress, setInProgress] = useState(false);

  const handleSetup = async () => {
    setInProgress(true);
    // step 0
    const res0Schema = z.object({
      data: z.array(SuperAdminModel),
    });

    const res0 = await fetch("/api/dev/setup/super-admin", {
      method: "POST",
    }).then((res) => res.json());

    const superAdmins = res0Schema.parse(res0).data;

    // step 1
    const res1Schema = z.object({
      data: z.array(GroupAdminModel),
    });
    const res1 = await fetch("/api/dev/setup/group-admin", {
      method: "POST",
    }).then((res) => res.json());

    const groupAdmins = res1Schema.parse(res1).data;

    // step 2
    const allocationGroupSchema = z.object({
      data: z.array(AllocationGroupModel),
    });
    const res2 = await fetch("/api/dev/setup/allocation-group", {
      method: "POST",
      body: JSON.stringify({
        superAdmins,
        groupAdmins,
      }),
    }).then((res) => res.json());

    const allocationGroups = allocationGroupSchema.parse(res2).data;

    // step 3
    const allocationSubGroupSchema = z.object({
      data: z.array(AllocationSubGroupModel),
    });
    const res3 = await fetch("/api/dev/setup/allocation-sub-group", {
      method: "POST",
      body: JSON.stringify({
        allocationGroups,
      }),
    }).then((res) => res.json());

    const allocationSubGroups = allocationSubGroupSchema.parse(res3).data;

    // step 4
    const subGroupAdminSchema = z.object({
      data: z.array(AllocationSubGroupModel),
    });
    const res4 = await fetch("/api/dev/setup/sub-group-admin", {
      method: "POST",
      body: JSON.stringify({
        allocationSubGroups,
      }),
    }).then((res) => res.json());

    const subGroupAdmins = subGroupAdminSchema.parse(res4).data;

    // step 5
    const allocationInstanceSchema = z.object({
      data: AllocationInstanceModel,
    });
    const res5 = await fetch("/api/dev/setup/allocation-instance", {
      method: "POST",
      body: JSON.stringify({
        allocationSubGroups,
      }),
    }).then((res) => res.json());

    const testInstance = allocationInstanceSchema.parse(res5).data;

    // step 6
    const supervisorSchema = z.object({
      data: SupervisorModel,
    });
    const res6 = await fetch("/api/dev/setup/supervisor", {
      method: "POST",
      body: JSON.stringify({
        testInstance,
      }),
    }).then((res) => res.json());

    const supervisors = supervisorSchema.parse(res6).data;

    // step 7
    const flagSchema = z.object({
      data: z.array(FlagModel),
    });

    const res7 = await fetch("/api/dev/setup/flag", {
      method: "POST",
    }).then((res) => res.json());

    const flags = flagSchema.parse(res7).data;

    // step 8
    const tagSchema = z.object({
      data: z.array(TagModel),
    });

    const res8 = await fetch("/api/dev/setup/tag", {
      method: "POST",
    }).then((res) => res.json());

    const tags = tagSchema.parse(res8).data;

    // step 9
    const studentSchema = z.object({
      data: z.array(StudentModel),
    });

    const res9 = await fetch("/api/dev/setup/student", {
      method: "POST",
      body: JSON.stringify({
        flags,
        testInstance,
      }),
    }).then((res) => res.json());

    const students = studentSchema.parse(res9).data;

    // step 10
    const projectSchema = z.object({
      data: z.array(ProjectModel),
    });

    const res10 = await fetch("/api/dev/setup/project", {
      method: "POST",
      body: JSON.stringify({
        supervisors,
        testInstance,
        flags,
        tags,
      }),
    }).then((res) => res.json());

    const projects = projectSchema.parse(res10).data;

    setInProgress(false);
  };

  const handleReset = async () => {
    setInProgress(true);
    await fetch("/api/dev/reset", { method: "DELETE" });
    setInProgress(false);
  };

  return (
    <div className="flex w-2/3 max-w-7xl flex-col gap-6 ">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">dev-panel</h1>
      </div>
      <div className="mt-5 flex w-fit flex-col gap-5">
        <Button variant="admin" onClick={handleSetup} disabled={inProgress}>
          {inProgress ? "loading" : "start setup"}
        </Button>

        <Button
          variant="destructive"
          onClick={handleReset}
          disabled={inProgress}
        >
          {inProgress ? "waiting" : "reset db"}
        </Button>
      </div>
    </div>
  );
}
