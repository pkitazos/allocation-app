export function UserCreationErrorCard({
  error,
  affectedUsers,
}: {
  error: string;
  affectedUsers: string[];
}) {
  return (
    <p>
      <p className="font-semibold">{error}</p>
      <p>Users affected:</p>
      <ul className="list-disc pl-4">
        {affectedUsers.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </p>
  );
}
