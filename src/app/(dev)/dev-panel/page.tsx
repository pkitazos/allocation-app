"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { sleep } from "@/lib/utils";
import { useState } from "react";

export default function Page() {
  const [progress, setProgress] = useState(0);

  const handleProgress = () => {
    sleep(3);
    setProgress((prev) => prev + 10);
  };

  const setup = async (endpoint: string) => {
    await fetch(`/api/dev/setup/${endpoint}`, { method: "POST" });
    handleProgress();
  };

  const handleSetUp = async () => {
    if (progress >= 100) {
      setProgress(0);
    } else {
      await setup("group-admin");
      await setup("allocation-group");
      await setup("allocation-sub-group");
      await setup("sub-group-admin");
      await setup("allocation-instance");
      await setup("supervisors");
      await setup("flags");
      await setup("tags");
      await setup("students");
      await setup("projects");
      await setup("student-flag");
      await setup("project-flag-tag");
    }
  };

  return (
    <div className="flex w-2/3 max-w-7xl flex-col gap-6 ">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">dev-panel</h1>
      </div>
      <div>
        <h2 className="mb-4 ml-4 text-xl">setup progress</h2>
        <Progress value={progress} />
      </div>
      <div className="mt-5 flex w-fit flex-col gap-5">
        <Button
          variant="admin"
          onClick={handleSetUp}
          disabled={progress !== 0 && progress < 100}
        >
          {progress === 0
            ? "start setup"
            : progress < 100
            ? "loading"
            : "reset"}
        </Button>
      </div>
    </div>
  );
}
