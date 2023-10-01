import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  console.log(session);

  return (
    <div className="-mt-[12dvh] grid h-[92dvh] place-items-center">
      <h1 className="text-4xl">
        Welcome{" "}
        <span className="font-semibold text-secondary">
          {user?.name ?? "user"}
        </span>
        !
      </h1>
    </div>
  );
}
