import { Button } from "@/components/ui/button";
import { useAllocDetailsContext } from "../allocation-store";

export function SubmitButton() {
  const isValid = useAllocDetailsContext((s) => s.isValid);
  return <Button disabled={!isValid}>Submit Changes</Button>;
}
