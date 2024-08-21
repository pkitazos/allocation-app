import { MergeIcon, PlusIcon, SettingsIcon, SplitIcon } from "lucide-react";

export function Icon({ type }: { type: string }) {
  switch (type) {
    case "settings":
      return <SettingsIcon className="h-4 w-4" />;
    case "split":
      return <SplitIcon className="h-4 w-4" />;
    case "merge":
      return <MergeIcon className="h-4 w-4" />;
    case "plus":
      return <PlusIcon className="h-4 w-4" />;
    default:
      return null;
  }
}
