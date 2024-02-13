import { Button } from "@/components/ui/button";
import { useAllocDetails } from "./allocation-store";
import { withinBounds } from "@/lib/utils/allocation-within-bounds";

export function SubmitButton() {
  const allProjects = useAllocDetails((s) => s.projects);
  const valid = allProjects.map(withinBounds).every(Boolean);

  return <Button disabled={!valid}>Submit Changes</Button>;
}
