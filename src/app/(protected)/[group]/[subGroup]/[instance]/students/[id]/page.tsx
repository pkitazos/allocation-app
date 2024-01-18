import { api } from "@/lib/trpc/server";

export default async function Student({
  params: { id },
}: {
  params: { id: string };
}) {
  const student = await api.user.student.getById.query({ studentId: id });

  return (
    <>
      <div className="flex w-2/3 max-w-7xl flex-col">
        <div className="flex rounded-md bg-accent px-6 py-5">
          <h1 className="text-5xl text-accent-foreground">{student.name}</h1>
        </div>
      </div>
    </>
  );
}
