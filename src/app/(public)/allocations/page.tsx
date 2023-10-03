// accessible by admins only
import { prisma } from "@/lib/prisma";
import { ClientSection } from "./client-section";

export default async function Page() {
  const allocations = await prisma.allocation.findMany({
    select: {
      project: { select: { id: true, title: true } },
      student: { select: { id: true, name: true, schoolId: true } },
    },
  });

  const data = allocations.map(({ project, student }) => ({
    projectTitle: project.title,
    projectId: project.id,
    studentName: student.name,
    studentId: student.id,
    schoolId: student.schoolId,
  }));

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">Allocations</h1>
      </div>
      <ClientSection data={data} />
    </div>
  );
}
