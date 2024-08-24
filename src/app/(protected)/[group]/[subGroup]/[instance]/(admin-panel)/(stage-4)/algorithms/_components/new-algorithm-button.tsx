"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { NewAlgorithmForm } from "./new-algorithm-form";

export function NewAlgorithmButton({ takenNames }: { takenNames: string[] }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Separator />
      {showForm ? (
        <NewAlgorithmForm setShowForm={setShowForm} takenNames={takenNames} />
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          Add Custom Algorithm
        </Button>
      )}
    </>
  );
}
