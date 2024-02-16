"use client";
import { Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";
import { stageSchema } from "@/lib/validations/stage";

import { useInstanceParams } from "@/components/params-context";
import { StageButton } from "./_components/stage-button";

export function StageControl({ stage }: { stage: Stage }) {
  const params = useInstanceParams();

  const router = useRouter();
  const stages = stageSchema.options;
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [confirmedIdx, setConfirmedIdx] = useState(stages.indexOf(stage) + 1);

  const { mutateAsync } = api.institution.instance.setStage.useMutation();

  const handleConfirmation = (idx: number) => {
    toast.promise(
      mutateAsync({
        params,
        stage: stages[idx - 1],
      }).then(() => {
        setSelectedIdx(-1);
        setConfirmedIdx(idx);
        router.refresh();
      }),
      {
        loading: "Updating Stage...",
        error: "Something went wrong",
        success: "Success",
      },
    );
  };

  return (
    <div className="mx-16 mt-12 flex justify-between px-6">
      <ol className="flex flex-col gap-7">
        <StageButton
          title="Setup"
          num={1}
          selectedIdx={selectedIdx}
          confirmedIdx={confirmedIdx}
          setSelectedIdx={setSelectedIdx}
        />
        <StageButton
          title="Project Submission"
          num={2}
          selectedIdx={selectedIdx}
          confirmedIdx={confirmedIdx}
          setSelectedIdx={setSelectedIdx}
        />
        <StageButton
          title="Project Selection"
          num={3}
          selectedIdx={selectedIdx}
          confirmedIdx={confirmedIdx}
          setSelectedIdx={setSelectedIdx}
        />
        <StageButton
          title="Project Allocation"
          num={4}
          selectedIdx={selectedIdx}
          confirmedIdx={confirmedIdx}
          setSelectedIdx={setSelectedIdx}
        />
        <StageButton
          title="Adjusting Project Allocation"
          num={5}
          selectedIdx={selectedIdx}
          confirmedIdx={confirmedIdx}
          setSelectedIdx={setSelectedIdx}
        />
        <StageButton
          title="Publishing Project Allocation"
          num={6}
          selectedIdx={selectedIdx}
          confirmedIdx={confirmedIdx}
          setSelectedIdx={setSelectedIdx}
        />
      </ol>
      <Button
        className="self-end"
        disabled={selectedIdx === -1}
        onClick={() => handleConfirmation(selectedIdx)}
      >
        confirm
      </Button>
    </div>
  );
}
