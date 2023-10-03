"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <>
      <div className="grid place-items-center">{error.message}</div>
    </>
  );
}
