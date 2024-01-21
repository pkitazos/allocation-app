import { api } from "@/lib/trpc/server";
import Link from "next/link";
import { Button } from "./ui/button";

export async function UserInstances() {
  const instances = await api.user.instances.query();

  return (
    <div className="h-40">
      <h2 className="mb-10 text-xl font-semibold underline decoration-secondary decoration-4">
        Your instances
      </h2>
      {instances.map((instance, i) => (
        <Button className="h-24 w-48" key={i} variant="outline" size="lg">
          <Link href="">{instance.allocationInstanceId}</Link>
        </Button>
      ))}
    </div>
  );
}
