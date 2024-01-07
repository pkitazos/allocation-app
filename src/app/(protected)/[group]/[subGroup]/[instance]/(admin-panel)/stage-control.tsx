"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

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

  const handleSelection = (idx: number) => {
    if (idx === selectedIdx) setSelectedIdx(-1);
    else setSelectedIdx(idx);
  };

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

  function StageButton({ title, num }: { title: string; num: number }) {
    return (
      <li className="flex items-center gap-9">
        <button
          onClick={() => handleSelection(num)}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-medium",
            selectedIdx === num && "border-4 border-amber-500",
            confirmedIdx >= num && "bg-primary text-primary-foreground",
          )}
        >
          {num}
        </button>
        <h3>{title}</h3>
      </li>
    );
  }

  return (
    <div className="mx-16 mt-20 flex justify-between px-6">
      <ol className="flex flex-col gap-10">
        <StageButton num={1} title="Setup" />
        <StageButton num={2} title="Project Submission" />
        <StageButton num={3} title="Project Selection" />
        <StageButton num={4} title="Project Allocation" />
        <StageButton num={5} title="Adjusting Project Allocation" />
        <StageButton num={6} title="Publishing Project Allocation" />
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
