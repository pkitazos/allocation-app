interface props {
  message: string;
}

export function Unauthorised({ message }: props) {
  return (
    <section className="grid h-[70dvh] place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-semibold">Unauthorised</h1>
        <p>{message}</p>
      </div>
    </section>
  );
}
