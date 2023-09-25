import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  if (!user) return;

  return (
    <div className="grid h-[92dvh] place-items-center -mt-[12dvh]">
      <h1 className="text-4xl">
        Welcome{" "}
        <span className="text-secondary font-semibold">{user.username}</span>!
      </h1>
    </div>
  );
}
