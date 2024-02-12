import { Button } from "@/components/ui/button";
import { useAllocDetails } from "../allocation-store";

export function SubmitButton() {
  const isValid = useAllocDetails((s) => s.validOverall);
  return <Button disabled={!isValid}>Submit Changes</Button>;
}
