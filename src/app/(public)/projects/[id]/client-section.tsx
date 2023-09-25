"use client";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export function ClientSection({ projectId }: { projectId: String }) {
  const [currentlyShortlisted, setCurrentlyShortlisted] = useState(false);

  const studentId = "636d1a57-8ffb-4535-a43a-8a5536245bc1";

  const handleClick = async () => {
    setCurrentlyShortlisted(!currentlyShortlisted);

    if (!currentlyShortlisted) {
      await fetch(`/api/shortlist/${projectId}`, {
        method: "POST",
        body: JSON.stringify({
          studentId,
        }),
      });
    } else {
      await fetch(`/api/shortlist/${projectId}`, {
        method: "DELETE",
        body: JSON.stringify({
          studentId,
        }),
      });
    }
  };

  return (
    <>
      <Toggle onClick={handleClick} variant="primary">
        {currentlyShortlisted ? "remove from Shortlist" : "add to shortlist"}
      </Toggle>
    </>
  );
}
