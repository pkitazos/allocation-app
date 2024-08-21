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
  myProjects: {
    title: "My Projects",
    href: "my-projects",
    icon: "folder-pen",
  },
  newProject: {
    title: "New Project",
    href: "new-project",
    icon: "file-plus-2",
  },
  myAllocations: {
    title: "My Allocations",
    href: "my-allocations",
    icon: "folder",
  },
  myPreferences: {
    title: "My Preferences",
    href: "my-preferences",
    icon: "files",
  },
  myAllocation: {
    title: "My Allocation",
    href: "my-allocation",
    icon: "file-badge",
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
