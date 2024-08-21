import { Role, Stage } from "@prisma/client";

import { instanceTabs } from "../instance-tabs";

import { adminPanelTabs as tabs } from "./index";

export function getTabs({
  additionalRole = Role.ADMIN,
  parentInstanceId,
}: {
  additionalRole?: Role;
  parentInstanceId: string | null;
}): Record<Stage, { title: string; href: string; action: boolean }[]> {
  return {
    [Stage.SETUP]: [tabs.addStudents, tabs.addSupervisors],

    [Stage.PROJECT_SUBMISSION]: addTabs(
      additionalRole,
      [tabs.supervisorInvites, tabs.projectSubmissions],
      [instanceTabs.myProjects, instanceTabs.newProject],
    ),

    [Stage.PROJECT_SELECTION]: addTabs(
      additionalRole,
      [tabs.studentInvites, tabs.preferenceSubmissions, tabs.lateProposals],
      [instanceTabs.myProjects, instanceTabs.newProject],
    ),

    [Stage.PROJECT_ALLOCATION]: addTabs(
      additionalRole,
      [tabs.algorithmsOverview, tabs.algorithmDetails],
      [instanceTabs.myProjects],
    ),

    [Stage.ALLOCATION_ADJUSTMENT]: addTabs(
      additionalRole,
      [tabs.manualChanges],
      [instanceTabs.myProjects],
    ),

    [Stage.ALLOCATION_PUBLICATION]: addTabs(
      additionalRole,
      [
        tabs.allocationOverview,
        tabs.exportToCSV,
        !parentInstanceId ? tabs.forkInstance : tabs.mergeInstance,
      ],
      [instanceTabs.myProjects, instanceTabs.myAllocations],
    ),
  };
}

function addTabs(
  role: Role,
  tabs: { title: string; href: string; action: boolean }[],
  conditionalTabs: { title: string; href: string }[],
) {
  return role === Role.SUPERVISOR
    ? [...tabs, ...conditionalTabs.map((tab) => ({ ...tab, action: false }))]
    : tabs;
}
