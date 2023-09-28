import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  if (!user) return;

  return (
    <div className="-mt-[12dvh] grid h-[92dvh] place-items-center">
      <h1 className="text-4xl">
        Welcome{" "}
        <span className="font-semibold text-secondary">{user.username}</span>!
      </h1>
    </div>
  );
}
