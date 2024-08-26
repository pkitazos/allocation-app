"use client";
import { CopyIcon } from "lucide-react";

import { copyToClipboard } from "@/lib/utils/general/copy-to-clipboard";

import { Button } from "./ui/button";

export function CopyEmailsButton<T extends { email: string }>({
  data,
}: {
  data: T[];
}) {
  const emails = data.map((d) => d.email).join(", ");
  return (
    <Button
      disabled={data.length === 0}
      variant="outline"
      onClick={async () =>
        await copyToClipboard(emails, `${data.length} emails`)
      }
    >
      <CopyIcon className="mr-2 h-4 w-4" />
      <span>Copy Emails</span>
    </Button>
  );
}
