import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { FormSection } from "./form-section";

export default async function Page() {
  const session = await auth();
  const user = session!.user;

  if (user.role !== "SUPER_ADMIN") {
    return (
      <Unauthorised message="You need to be a super-admin to access this page" />
    );
  }
  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h2 className="text-4xl">
        Create New{" "}
        <span className="font-semibold text-sky-500">Allocation Sub-Group</span>
      </h2>
      <FormSection />
    </div>
  );
}
