import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";

import { MutationButton } from "./mutation-button";
import { Button } from "@/components/ui/button";
import { PreferenceType } from "@prisma/client";

export default async function Page({ params }: { params: instanceParams }) {
  const session = await auth();

  if (session && session.user.role !== "STUDENT") {
    return (
      <Unauthorised message="You need to be a Student to access this page" />
    );
  }

  const { PREFERENCE: preferences, SHORTLIST: shortlist } =
    await api.user.student.preference.getLists.query({ params });

  return (
    <>
      <div className="flex w-2/3 max-w-7xl flex-col">
        <div className="flex rounded-md bg-accent px-6 py-5">
          <h1 className="text-5xl text-accent-foreground">Preferences</h1>
        </div>
        <section className="grid grid-cols-2 gap-6 pt-14">
          <div className="flex h-max min-h-[50dvh] flex-col gap-4 rounded-md bg-accent/50 px-6 py-5">
            <h2 className="text-xl font-semibold text-primary underline decoration-2 underline-offset-2">
              Preferences
            </h2>
            {preferences.map(({ project: { id: projectId, title } }) => (
              <p
                key={projectId}
                className="flex flex-col gap-3 rounded-md bg-slate-200 px-4 py-3 font-medium"
              >
                {title}
                <div className="flex justify-end gap-4">
                  <a href={`projects/${projectId}`}>
                    <Button variant="link" size="sm">
                      view
                    </Button>
                  </a>
                  <MutationButton
                    params={params}
                    projectId={projectId}
                    updatedStatus={PreferenceType.SHORTLIST}
                  >
                    make shortlist
                  </MutationButton>
                  <MutationButton params={params} projectId={projectId}>
                    remove
                  </MutationButton>
                </div>
              </p>
            ))}
          </div>
          <div className="flex h-max min-h-[50dvh] flex-col gap-4 rounded-md bg-accent/50 px-6 py-5">
            <h2 className="text-xl font-semibold text-primary underline decoration-2 underline-offset-2">
              Shortlist
            </h2>
            {shortlist.map(({ project: { id: projectId, title } }) => (
              <p
                key={projectId}
                className="flex flex-col gap-3 rounded-md bg-slate-200 px-4 py-3 font-medium"
              >
                {title}
                <div className="flex justify-end gap-4">
                  <a href={`projects/${projectId}`}>
                    <Button variant="link" size="sm">
                      view
                    </Button>
                  </a>
                  <MutationButton
                    params={params}
                    projectId={projectId}
                    updatedStatus={PreferenceType.PREFERENCE}
                  >
                    make preference
                  </MutationButton>
                  <MutationButton params={params} projectId={projectId}>
                    remove
                  </MutationButton>
                </div>
              </p>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
