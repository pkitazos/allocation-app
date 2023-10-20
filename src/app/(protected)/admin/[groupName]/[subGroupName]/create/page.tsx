import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { FormSection } from "./form-section";

export default async function Page() {
  const session = await auth();
  const user = session!.user;

  if (user.role !== "SUPER_ADMIN" && user.role !== "GROUP_ADMIN") {
    return (
      <Unauthorised message="You need to be a super-admin to access this page" />
    );
  }
  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h2 className="text-4xl">
        Create new{" "}
        <span className="font-semibold text-sky-500">Allocation Instance</span>
      </h2>
      <FormSection />
    </div>
  );
}
