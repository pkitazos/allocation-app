import { Stage } from "@prisma/client";

export const adminPanelTabs: Record<Stage, { title: string; href: string }[]> =
  {
    SETUP: [
      { title: "Add Supervisors", href: "add-supervisors" },
      { title: "Add Students", href: "add-students" },
    ],
    PROJECT_SUBMISSION: [
      { title: "Supervisor Invites", href: "supervisor-invites" },
      { title: "Project Submissions", href: "project-submissions" },
    ],
    PROJECT_SELECTION: [
      { title: "Student Invites", href: "student-invites" },
      { title: "Preference Submissions", href: "preference-submissions" },
    ],
    PROJECT_ALLOCATION: [
      { title: "Algorithms Overview", href: "algorithms-overview" },
      { title: "Algorithm Details", href: "algorithm-details" },
    ],
    ALLOCATION_ADJUSTMENT: [
      { title: "Manual Changes", href: "manual-changes" },
    ],
    ALLOCATION_PUBLICATION: [
      { title: "Allocation Overview", href: "allocation-overview" },
    ],
  } as const;
