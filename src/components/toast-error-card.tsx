export function ToastErrorCard({
  title,
  errors,
  getError = (error) => error.message,
}: {
  title: string;
  errors: Zod.ZodIssue[];
  getError?: (error: Zod.ZodIssue) => string;
}) {
  const uniqueErrors = [...new Set(errors.map(getError))];
  return (
    <p>
      <p className="font-semibold">{title}</p>
      <ul className="list-disc pl-4">
        {uniqueErrors.map((e) => (
          <li>{e}</li>
        ))}
      </ul>
    </p>
  );
}
