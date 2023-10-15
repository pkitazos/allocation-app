import { ReactNode } from "react";

export default async function AdminPanel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex w-2/3 max-w-7xl flex-col gap-6 ">
      <div className="flex rounded-md bg-secondary px-6 py-5">
        <h1 className="text-5xl text-accent">Admin Panel</h1>
      </div>
      {children}
    </div>
  );
}
