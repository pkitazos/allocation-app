import { adminPanelTabs } from "./index";

export const instanceTabs = {
  instanceHome: {
    title: "Instance Home",
    href: "",
  },
  allProjects: {
    title: "All Projects",
    href: "projects",
  },
  allSupervisors: {
    title: "All Supervisors",
    href: "supervisors",
  },
  allStudents: {
    title: "All Students",
    href: "students",
  },
  myProjects: {
    title: "My Projects",
    href: "my-projects",
  },
  newProject: {
    title: "New Project",
    href: "new-project",
    actionType: "plus",
  },
  myAllocations: {
    title: "My Allocations",
    href: "my-allocations",
  },
  myPreferences: {
    title: "My Preferences",
    href: "my-preferences",
  },
  myAllocation: {
    title: "My Allocation",
    href: "my-allocation",
  },
};

export const supervisorTabs = [
  instanceTabs.allProjects,
  instanceTabs.myProjects,
  instanceTabs.newProject,
  instanceTabs.myAllocations,
];

export const studentTabs = [
  instanceTabs.allProjects,
  instanceTabs.myPreferences,
  instanceTabs.myAllocation,
];

export const supervisorRoutes: string[] = Object.values(supervisorTabs).map(
  (tab) => tab.href,
);

export const studentRoutes: string[] = Object.values(studentTabs).map(
  (tab) => tab.href,
);

export const adminRoutes: string[] = [
  ...Object.values(adminPanelTabs).map((tab) => tab.href),
  instanceTabs.allProjects.href,
  instanceTabs.allSupervisors.href,
  instanceTabs.allStudents.href,
];
