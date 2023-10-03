import { auth, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await auth();

  if (!session) return <>you are not signed in</>;

  const user = session.user;

  console.log(user.email);

  const isGroupAdmin = await prisma.groupAdmin.findFirst({
    where: { email: user.email! },
  });
  const isSubGroupAdmin = await prisma.subGroupAdmin.findFirst({
    where: { email: user.email! },
  });
  const isSupervisor = await prisma.supervisor.findFirst({
    where: { email: user.email! },
  });
  const isStudent = await prisma.student.findFirst({
    where: { email: user.email! },
  });

  let name = "";
  if (isGroupAdmin) name = isGroupAdmin.name;
  if (isSubGroupAdmin) name = isSubGroupAdmin.name;
  if (isSupervisor) name = isSupervisor.name;
  if (isStudent) name = isStudent.name;

  return (
    <div>
      <h2 className="mb-2 text-2xl">
        Hi <span className="font-medium text-sky-600">{name}</span>,
      </h2>
      this is your account page
    </div>
  );
}
