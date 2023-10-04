import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function Page() {
  const session = await auth();

  const user = session!.user;

  return (
    <div className="flex h-[70dvh] w-full flex-col gap-6 pt-16 xl:w-1/2">
      <h2 className="text-4xl font-medium">
        Hi <span className="font-semibold text-sky-500">{user.name}</span>!
      </h2>
      <h3 className="text-xl">This is your account page</h3>
      <p
        className={cn(
          "w-fit rounded-md bg-emerald-500/20 px-4 py-2 text-lg",
          user.role === "UNREGISTERED" && "bg-destructive/20",
        )}
      >
        user role :{" "}
        <span
          className={cn(
            "font-semibold text-emerald-500",
            user.role === "UNREGISTERED" && "text-destructive",
          )}
        >
          {user.role}
        </span>
      </p>
    </div>
  );
}
