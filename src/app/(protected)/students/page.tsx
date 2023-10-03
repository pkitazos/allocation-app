import { prisma } from "@/lib/prisma";
import { ClientSection } from "./client-section";

export default async function Students() {
  const students = await prisma.student.findMany({});

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">Students</h1>
      </div>
      <ClientSection data={students} />
    </div>
  );
}
