"use client";
import { CircleAlertIcon } from "@/components/icons/circle-alert";
import { CircleCheckIcon } from "@/components/icons/circle-check";
import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

import { DownloadCSVButton } from "./download-csv-button";

export function ResultsCard<
  T extends {
    total: number;
    exist: number;
  },
>({
  userRole,
  csvContent,
  data: { total, exist },
}: {
  userRole: string;
  csvContent: string;
  data: T;
}) {
  const allUsersExist = total === exist;
  const Icon = allUsersExist ? CircleCheckIcon : CircleAlertIcon;

  return (
    <Card className="w-full">
      <CardContent className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p>
            {exist} of {total} {userRole} exist on the assessment system
          </p>
          <Icon
            className={cn(
              allUsersExist
                ? "rounded-full border-green-500 bg-green-100 text-green-500"
                : "rounded-full border-amber-500 bg-amber-100 text-amber-500",
            )}
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <DownloadCSVButton itemName={userRole} csvContent={csvContent} />
        </div>
      </CardContent>
    </Card>
  );
}
