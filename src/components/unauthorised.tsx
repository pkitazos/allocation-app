export function Unauthorised({
  title = "Unauthorised",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <section className="grid h-[70dvh] place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p>{message}</p>
      </div>
    </section>
  );
}
