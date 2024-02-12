"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { instanceParams } from "@/lib/validations/params";
import { useState } from "react";
import { NewAlgorithmForm } from "./new-algorithm-form";

export function NewAlgorithmButton({
  params,
  takenNames,
}: {
  params: instanceParams;
  takenNames: string[];
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Separator />
      {showForm ? (
        <NewAlgorithmForm
          setShowForm={setShowForm}
          params={params}
          takenNames={takenNames}
        />
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          Add Custom Algorithm
        </Button>
      )}
    </>
  );
}
