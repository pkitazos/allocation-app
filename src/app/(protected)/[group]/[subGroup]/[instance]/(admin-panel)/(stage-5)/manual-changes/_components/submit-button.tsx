import { Button } from "@/components/ui/button";
import { allValid } from "../_utils/get-project";
import { useAllocDetails } from "./allocation-store";

export function SubmitButton() {
  const allProjects = useAllocDetails((s) => s.projects);
  const valid = allValid(allProjects);

  return <Button disabled={!valid}>Submit Changes</Button>;
}
