import { cn } from "@/lib/utils";

interface props {
  className?: string;
}

export const Divider = ({ className }: props) => {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="w-1/2 border-t-2 border-gray-300/50">&nbsp;</div>
    </div>
  );
};
