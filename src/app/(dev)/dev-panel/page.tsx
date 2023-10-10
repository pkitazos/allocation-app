"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Page() {
  const [inProgress, setInProgress] = useState(false);

  const handleSetup = async () => {
    setInProgress(true);
    await fetch("/api/dev/setup", { method: "POST" });
    setInProgress(false);
  };

  const handleReset = async () => {
    setInProgress(true);
    await fetch("/api/dev/reset", { method: "DELETE" });
    setInProgress(false);
  };

  return (
    <div className="flex w-2/3 max-w-7xl flex-col gap-6 ">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">dev-panel</h1>
      </div>
      <div className="mt-5 flex w-fit flex-col gap-5">
        <Button variant="admin" onClick={handleSetup} disabled={inProgress}>
          {inProgress ? "loading" : "start setup"}
        </Button>

        <Button
          variant="destructive"
          onClick={handleReset}
          disabled={inProgress}
        >
          {inProgress ? "waiting" : "reset db"}
        </Button>

        {/* <Button onClick={onClick} variant="destructive">
          test
        </Button> */}
      </div>
    </div>
  );
}
