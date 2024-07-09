import { Stage } from "@prisma/client";

export const adminPanelTabs: Record<
  Stage,
  { title: string; href: string; action: boolean }[]
> = {
  SETUP: [
    { title: "Add Supervisors", href: "add-supervisors", action: false },
    { title: "Add Students", href: "add-students", action: false },
  ],
  PROJECT_SUBMISSION: [
    { title: "Supervisor Invites", href: "supervisor-invites", action: false },
    {
      title: "Project Submissions",
      href: "project-submissions",
      action: false,
    },
  ],
  PROJECT_SELECTION: [
    { title: "Student Invites", href: "student-invites", action: false },
    {
      title: "Preference Submissions",
      href: "preference-submissions",
      action: false,
    },
  ],
  PROJECT_ALLOCATION: [
    {
      title: "Algorithms Overview",
      href: "algorithms-overview",
      action: false,
    },
    { title: "Algorithm Details", href: "algorithm-details", action: false },
  ],
  ALLOCATION_ADJUSTMENT: [
    { title: "Manual Changes", href: "manual-changes", action: false },
  ],
  ALLOCATION_PUBLICATION: [
    {
      title: "Allocation Overview",
      href: "allocation-overview",
      action: false,
    },
    { title: "Fork Instance", href: "fork-instance", action: true },
  ],
};
