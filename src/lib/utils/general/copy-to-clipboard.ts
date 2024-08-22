import { toast } from "sonner";

export async function copyToClipboard(val: string) {
  await navigator.clipboard.writeText(val).then(() => {
    toast.success(`Copied ${val} to clipboard!`);
  });
}
