"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import {
  allProjectsValid,
  getPreferenceRank,
  getUpdatedWeight,
} from "@/lib/utils/allocation-adjustment";
import { allSupervisorsValid } from "@/lib/utils/allocation-adjustment/supervisor";
import { zeros } from "@/lib/utils/general/zeros";

import { useAllocDetails } from "./allocation-store";
import { SubmitButton } from ".";

export function MatchingInfoTable() {
  const allProjects = useAllocDetails((s) => s.projects);
  const allStudents = useAllocDetails((s) => s.students);
  const allSupervisors = useAllocDetails((s) => s.supervisors);

  const isValid =
    allProjectsValid(allProjects) &&
    allSupervisorsValid(allProjects, allSupervisors);

  const pref = allStudents.map((row) => getPreferenceRank(allProjects, row));

  const profile = zeros(Math.max(...pref) + 1);
  pref.forEach((idx) => (profile[idx] += 1));

  const weight = getUpdatedWeight(profile);
  const size = profile.reduce((acc, val) => acc + val, 0);

  return (
    <Card className={"flex w-full flex-col"}>
      <CardHeader>
        <CardTitle className={cn(!isValid && "text-destructive")}>
          Matching Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="grid grid-cols-3 gap-2">
          <p className="col-span-1">Status:</p>
          <div className="col-span-2">
            {isValid ? (
              <Badge className="bg-green-600 text-base">Valid</Badge>
            ) : (
              <Badge variant="destructive" className="text-base">
                Invalid
              </Badge>
            )}
          </div>
          <p className="col-span-1">Profile:</p>
          <p className="col-span-2 font-semibold">{`(${profile.join(",")})`}</p>
          <p className="col-span-1">Weight:</p>
          <p className="col-span-2 font-semibold">{weight}</p>
          <p className="col-span-1">Size:</p>
          <p className="col-span-2 font-semibold">{size}</p>
        </div>
        <div className="flex flex-col justify-end">
          <SubmitButton />
        </div>
      </CardContent>
    </Card>
  );
}
