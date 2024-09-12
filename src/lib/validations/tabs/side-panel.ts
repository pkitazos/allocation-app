import { AllocationInstance, Role, Stage } from "@prisma/client";

import { TabGroup } from "./index";

import { pages } from "@/content/pages";

/**
 * @deprecated use pages from "@/content/pages" instead
 */
export const adminTabs = {
  settings: {
    title: "Settings",
    href: "settings",
    icon: "settings",
  },
  stageControl: {
    title: "Stage Control",
    href: "",
    icon: "layers",
  },
  addSupervisors: {
    title: "Add Supervisors",
    href: "add-supervisors",
    icon: "user-plus",
  },
  addStudents: {
    title: "Add Students",
    href: "add-students",
    icon: "user-plus",
  },
  supervisorInvites: {
    title: "Supervisor Invites",
    href: "supervisor-invites",
    icon: "users",
  },
  projectSubmissions: {
    title: "Project Submissions",
    href: "project-submissions",
    icon: "folder",
  },
  studentInvites: {
    title: "Student Invites",
    href: "student-invites",
    icon: "users",
  },
  preferenceSubmissions: {
    title: "Preference Submissions",
    href: "preference-submissions",
    icon: "folder-heart",
  },
  lateProposals: {
    title: "Late Proposals",
    href: "late-proposals",
    icon: "folder-clock",
  },
  algorithmsOverview: {
    title: "Algorithms",
    href: "algorithms",
    icon: "server",
  },
  algorithmDetails: {
    title: "Results",
    href: "results",
    icon: "square-kanban",
  },
  manualChanges: {
    title: "Manual Changes",
    href: "manual-changes",
    icon: "mouse-pointer",
  },
  allocationOverview: {
    title: "Allocation Overview",
    href: "allocation-overview",
    icon: "folder-lock",
  },
  forkInstance: {
    title: "Fork Instance",
    href: "fork-instance",
    icon: "split",
  },
  mergeInstance: {
    title: "Merge Instance",
    href: "merge-instance",
    icon: "merge",
  },
  exportToCSV: {
    title: "Export to CSV",
    href: "export-to-csv",
    icon: "file-spreadsheet",
  },
  exportToExternalSystem: {
    title: "Send Data to External System",
    href: "export-to-external-system",
    icon: "folder-output",
  },
  supervisorTasks: {
    title: "Tasks",
    href: "supervisor-tasks",
    icon: "list-checks",
  },
};

const adminOnlyTabs = (parentInstanceId: string | null) => ({
  [Stage.SETUP]: [pages.addStudents, pages.addSupervisors],
  [Stage.PROJECT_SUBMISSION]: [
    pages.supervisorInvites,
    pages.projectSubmissions,
    pages.addStudents,
    pages.addSupervisors,
  ],
  [Stage.PROJECT_SELECTION]: [
    pages.studentInvites,
    pages.preferenceSubmissions,
    pages.lateProposals,
    pages.addStudents,
    pages.addSupervisors,
  ],
  [Stage.PROJECT_ALLOCATION]: [
    pages.algorithms,
    pages.results,
    pages.preferenceStatistics,
  ],
  [Stage.ALLOCATION_ADJUSTMENT]: [pages.manualChanges],
  [Stage.ALLOCATION_PUBLICATION]: [
    pages.allocationOverview,
    pages.exportToCSV,
    !parentInstanceId ? pages.forkInstance : pages.mergeInstance,
  ],
});

const superVisorOnlyTabs = {
  [Stage.SETUP]: [],
  [Stage.PROJECT_SUBMISSION]: [pages.myProjects, pages.newProject],
  [Stage.PROJECT_SELECTION]: [pages.myProjects, pages.newProject],
  [Stage.PROJECT_ALLOCATION]: [pages.myProjects],
  [Stage.ALLOCATION_ADJUSTMENT]: [pages.myProjects],
  [Stage.ALLOCATION_PUBLICATION]: [pages.myProjects, pages.myAllocations],
};

const studentOnlyTabs = (preAllocatedProject: boolean) => {
  const base = preAllocatedProject ? [] : [pages.myPreferences];
  return {
    [Stage.SETUP]: [],
    [Stage.PROJECT_SUBMISSION]: [],
    [Stage.PROJECT_SELECTION]: base,
    [Stage.PROJECT_ALLOCATION]: base,
    [Stage.ALLOCATION_ADJUSTMENT]: base,
    [Stage.ALLOCATION_PUBLICATION]: [pages.myAllocation],
  };
};

export function getTabs({
  roles,
  instance,
  preAllocatedProject,
}: {
  roles: Set<Role>;
  instance: AllocationInstance;
  preAllocatedProject: boolean;
}): TabGroup[] {
  const tabs = [];

  if (roles.has(Role.ADMIN)) {
    tabs.push({
      title: "Admin",
      tabs: [pages.stageControl, pages.settings],
    });
    // TODO: don't display "Fork Instance" page if the instance already has a forked instance
    tabs.push({
      title: "Stage-specific",
      tabs: adminOnlyTabs(instance.parentInstanceId)[instance.stage],
    });
  }

  if (roles.has(Role.SUPERVISOR)) {
    const isSecondRole = roles.size > 1;
    const base = superVisorOnlyTabs[instance.stage];

    tabs.push({
      title: "Supervisor",
      tabs: !isSecondRole
        ? [pages.instanceTasks, ...base]
        : instance.stage === Stage.SETUP
          ? base
          : [pages.supervisorTasks, ...base],
    });
  }

  if (roles.has(Role.STUDENT)) {
    const isSecondRole = roles.size > 1;
    const base = studentOnlyTabs(preAllocatedProject)[instance.stage];

    tabs.push({
      title: "Student",
      tabs: isSecondRole ? base : [pages.instanceTasks, ...base],
    });
  }

  return tabs;
}
