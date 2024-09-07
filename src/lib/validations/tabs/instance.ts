/**
 * @deprecated use pages from "@/content/pages" instead
 */
export const instanceTabs = {
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
  instanceHome: {
    title: "Instance Home",
    href: "",
    icon: "home",
  },
  instanceTasks: {
    title: "Tasks",
    href: "",
    icon: "list-checks",
  },
  myProjects: {
    title: "My Projects",
    href: "my-projects",
    icon: "folder",
  },
  newProject: {
    title: "New Project",
    href: "new-project",
    icon: "file-plus-2",
  },
  myAllocations: {
    title: "My Allocations",
    href: "my-allocations",
    icon: "folder-check",
  },
  myPreferences: {
    title: "My Preferences",
    href: "my-preferences",
    icon: "folder-heart",
  },
  myAllocation: {
    title: "My Allocation",
    href: "my-allocation",
    icon: "file-check-2",
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
