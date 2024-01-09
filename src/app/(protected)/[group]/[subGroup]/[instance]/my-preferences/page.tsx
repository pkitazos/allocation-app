import { ClientSection } from "./client-section";
import { db } from "@/lib/db";
import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  if (session && session.user.role !== "STUDENT") {
    return (
      <Unauthorised message="You need to be a Student to access this page" />
    );
  }

  const studentId = "636d1a57-8ffb-4535-a43a-8a5536245bc1";

  const preferences = await db.preference.findMany({
    where: { studentId },
    select: {
      project: { select: { id: true, title: true } },
    },
  });

  const shortlist = await db.shortlist.findMany({
    where: { studentId },
    select: {
      project: { select: { id: true, title: true } },
    },
  });

  return (
    <>
      <div className="flex w-2/3 max-w-7xl flex-col">
        <div className="flex rounded-md bg-accent px-6 py-5">
          <h1 className="text-5xl text-accent-foreground">Preferences</h1>
        </div>
        <section className="grid grid-cols-2 gap-6 pt-14">
          <ClientSection
            studentId={studentId}
            preferences={preferences}
            shortlist={shortlist}
          />
        </section>
      </div>
    </>
  );
}
