import { Loader } from "lucide-react";

export default async function Home() {
  return (
    <div className="grid h-full place-items-center">
      <p className="flex flex-row gap-2">
        <Loader className="animate-spin" />
        <span>Loading...</span>
      </p>
    </div>
  );
}
