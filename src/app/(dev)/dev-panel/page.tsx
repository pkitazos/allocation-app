"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Page() {
  const [inProgress, setInProgress] = useState(false);

  const handleSetup = async () => {
    setInProgress(true);
    await fetch("/api/dev/setup", { method: "POST" });
    setInProgress(false);
  };

  const handleReset = async () => {
    setInProgress(true);
    await fetch("/api/dev/reset", { method: "DELETE" });
    setInProgress(false);
  };

  return (
    <div className="flex w-2/3 max-w-7xl flex-col gap-6 ">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">dev-panel</h1>
      </div>
      <div className="mt-5 flex w-fit flex-col gap-5">
        <Button variant="admin" onClick={handleSetup} disabled={inProgress}>
          {inProgress ? "loading" : "start setup"}
        </Button>

        <Button
          variant="destructive"
          onClick={handleReset}
          disabled={inProgress}
        >
          {inProgress ? "waiting" : "reset db"}
        </Button>

        {/* <Button onClick={onClick} variant="destructive">
          test
        </Button> */}
      </div>
    </div>
  );
}

const subGroupAdminNames = [
  [
    { name: "Bill", email: "subgroup.allocationapp@gmail.com" },
    { name: "Chris", email: "chris@example.com" },
    { name: "Dan", email: "dan@example.com" },
  ],
  [
    { name: "Florence", email: "florence@example.com" },
    { name: "Grant", email: "grant@example.com" },
  ],
  [
    { name: "Isaac", email: "isaac@example.com" },
    { name: "Jack", email: "jack@example.com" },
    { name: "Ken", email: "ken@example.com" },
  ],
];

const subGroups: {
  id: string;
  allocationGroupId: string;
}[] = [
  { id: "level 3", allocationGroupId: "group-1" },
  { id: "level 4", allocationGroupId: "group-1" },
  { id: "level 5", allocationGroupId: "group-1" },
  { id: "level 3", allocationGroupId: "group-2" },
  { id: "level 4", allocationGroupId: "group-2" },
  { id: "level 4", allocationGroupId: "group-3" },
  { id: "level 5", allocationGroupId: "group-3" },
  { id: "level 6", allocationGroupId: "group-3" },
];

const instanceNames = [
  [["2022", "2023"], ["2022", "2023"], ["2023"]],
  [
    ["2022", "2023"],
    ["2022", "2023"],
  ],
  [
    ["2022", "2023"],
    ["2022", "2023"],
    ["2022", "2023"],
  ],
];

const sampleOut = [
  { subGroupId: "level 3", name: "2022" },
  { subGroupId: "level 3", name: "2023" },
  { subGroupId: "level 4", name: "2022" },
  { subGroupId: "level 4", name: "2023" },
  { subGroupId: "level 5", name: "2022" },
  { subGroupId: "level 5", name: "2023" },
];

const onClick = () => {
  const flatInstanceNames = instanceNames.flat(1);
  const result = subGroups
    .map(({ id }, i) => {
      let temp = flatInstanceNames[i].map((name) => ({
        subGroupId: id,
        name: name,
      }));
      return temp;
    })
    .flat();

  console.log(result);
};
