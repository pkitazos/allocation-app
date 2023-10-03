"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface props {
  studentId: string;
  preferences: {
    project: {
      title: string;
      id: string;
    };
  }[];
  shortlist: {
    project: {
      title: string;
      id: string;
    };
  }[];
}

export function ClientSection({ studentId, preferences, shortlist }: props) {
  const router = useRouter();

  const makePreference = async (studentId: string, projectId: string) => {
    await fetch("/api/preference", {
      method: "POST",
      body: JSON.stringify({
        studentId,
        projectId,
      }),
    });
    router.refresh();
  };

  const deletePreference = async (studentId: string, projectId: string) => {
    await fetch("/api/preference", {
      method: "DELETE",
      body: JSON.stringify({
        studentId,
        projectId,
      }),
    });
    router.refresh();
  };

  const makeShortlist = async (studentId: string, projectId: string) => {
    await fetch("/api/shortlist", {
      method: "PATCH",
      body: JSON.stringify({
        studentId,
        projectId,
      }),
    });
    router.refresh();
  };

  const deleteShortlist = async (studentId: string, projectId: string) => {
    await fetch("/api/shortlist", {
      method: "DELETE",
      body: JSON.stringify({
        studentId,
        projectId,
      }),
    });
    router.refresh();
  };

  return (
    <>
      <div className="flex h-max min-h-[50dvh] flex-col gap-4 rounded-md bg-accent/50 px-6 py-5">
        <h2 className="text-xl font-semibold text-primary underline decoration-2 underline-offset-2">
          Preference List
        </h2>
        {preferences.map(({ project: { id: projectId, title } }) => (
          <p
            key={projectId}
            className="flex flex-col gap-3 rounded-md bg-slate-200 px-4 py-3 font-medium"
          >
            {title}
            <div className="flex justify-end gap-4">
              <a href={`/projects/${projectId}`}>
                <Button variant="link" size="sm">
                  view
                </Button>
              </a>
              <Button onClick={() => makeShortlist(studentId, projectId)}>
                make shortlist
              </Button>

              <Button
                onClick={() => deletePreference(studentId, projectId)}
                variant="destructive"
              >
                remove
              </Button>
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
              <a href={`/projects/${projectId}`}>
                <Button variant="link" size="sm">
                  view
                </Button>
              </a>
              <Button onClick={() => makePreference(studentId, projectId)}>
                make preference
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteShortlist(studentId, projectId)}
              >
                remove
              </Button>
            </div>
          </p>
        ))}
      </div>
    </>
  );
}
