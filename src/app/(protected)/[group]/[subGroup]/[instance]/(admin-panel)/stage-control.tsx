"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";
import { Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { StageButton } from "../../../../../../components/stage-button";

export function StageControl({
  group,
  subGroup,
  instance,
  stage,
}: {
  group: string;
  subGroup: string;
  instance: string;
  stage: Stage;
}) {
  const stages = Object.values(Stage);
  const router = useRouter();
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [confirmedIdx, setConfirmedIdx] = useState(stages.indexOf(stage) + 1);

  const { mutateAsync } = api.institution.instance.setStage.useMutation();

  const handleConfirmation = (idx: number) => {
    toast.promise(
      mutateAsync({
        group,
        subGroup,
        instance,
        stage: stages[idx - 1],
      }).then(() => {
        setSelectedIdx(-1);
        setConfirmedIdx(idx);
        router.refresh();
      }),
      {
        loading: "Updating Stage...",
        error: "Something went wrong",
        success: "Succcess",
      },
    );
  };

  return (
    <div className="mx-16 mt-20 flex justify-between px-6">
      <ol className="flex flex-col gap-10">
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
