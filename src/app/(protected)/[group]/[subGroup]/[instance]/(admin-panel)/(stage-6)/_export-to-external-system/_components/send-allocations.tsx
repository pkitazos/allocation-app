"use client";

import { ForwardIcon } from "lucide-react";
import { unparse } from "papaparse";

import { CircleAlertIcon } from "@/components/icons/circle-alert";
import { CircleCheckIcon } from "@/components/icons/circle-check";
import { useInstanceParams } from "@/components/params-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

import { DownloadCSVButton } from "./download-csv-button";

export function CreateProjectsSection() {
  const params = useInstanceParams();
  const {
    data,
    status,
    mutateAsync: createProjectsAsync,
  } = api.institution.instance.external.createProjects.useMutation();

  return (
    <div className="flex flex-col items-start gap-3">
      <p>Create projects on Assessment System</p>
      <Button
        variant="secondary"
        className="flex cursor-pointer items-center gap-2"
        onClick={() => createProjectsAsync({ params })}
      >
        <ForwardIcon className="h-4 w-4" />
        <p>Create Projects</p>
      </Button>
      {status === "pending" && <Skeleton className="h-10 w-full" />}
      {status === "success" && <ResultsCard data={data} />}
    </div>
  );
}

function ResultsCard({
  data: { createdProjects, created, total },
}: {
  data: {
    createdProjects: { id: string; created: 0 | 1 }[];
    created: number;
    total: number;
  };
}) {
  const allProjectsCreated = created === total && total > 0;
  const Icon = allProjectsCreated ? CircleCheckIcon : CircleAlertIcon;

  return (
    <Card className="w-full">
      <CardContent className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p>
            {created} of {total} projects successfully created on the assessment
            system
          </p>
          <Icon
            className={cn(
              allProjectsCreated
                ? "rounded-full border-green-500 bg-green-100 text-green-500"
                : "rounded-full border-amber-500 bg-amber-100 text-amber-500",
            )}
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <DownloadCSVButton
            itemName="project"
            csvContent={unparse({
              fields: ["Project ID", "Created in Assessment System"],
              data: createdProjects.map((e) => [e.id, e.created]),
            })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
