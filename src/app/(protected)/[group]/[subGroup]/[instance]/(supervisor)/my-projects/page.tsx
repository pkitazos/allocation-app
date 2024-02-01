import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  if (session && session.user.role !== "SUPERVISOR") {
    return (
      <Unauthorised message="You need to be a Supervisor to access this page" />
    );
  }
  return <div>this is your projects page page</div>;
}
