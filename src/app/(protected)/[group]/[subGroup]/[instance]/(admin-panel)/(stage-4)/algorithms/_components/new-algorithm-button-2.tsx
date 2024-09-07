"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { NewAlgorithmForm2 } from "./new-algorithm-form2";

export function NewAlgorithmButton2({ takenNames }: { takenNames: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Configure New Algorithm</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Configure New Algorithm</DialogTitle>
          <DialogDescription>
            Select the algorithm flags and capacity modifiers you want then
            click the &quot;Create&quot; button
          </DialogDescription>
        </DialogHeader>
        <NewAlgorithmForm2 takenNames={takenNames} setShowForm={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
