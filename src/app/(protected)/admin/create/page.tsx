import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  const user = session!.user;

  if (user.role !== "SUPER_ADMIN") {
    return (
      <Unauthorised message="You need to be a super-admin to access this page" />
    );
  }

  const invitedGroupAdmins = [
    { name: "ebeunai", email: "aeuydgeja" },
    { name: "ebeunai", email: "aeuydgeja" },
    { name: "ebeunai", email: "aeuydgeja" },
  ];
  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h2 className="text-4xl">Create New Allocation Group</h2>
      <div className="mt-10 flex flex-col gap-6">
        <div className="flex flex-col items-start gap-3">
          <h3 className="text-2xl">Allocation Group Name</h3>
          <Input className="w-1/2" />
        </div>
        <div className="mt-10 flex w-full flex-col items-start gap-3">
          <h3 className="text-2xl">Add Allocation Group Admins</h3>
          <div className="flex w-full items-center justify-start gap-5">
            <Input className="w-1/3" placeholder="Name" />
            <Input className="w-2/5" placeholder="Email" type="email" />
            <Button>invite</Button>
          </div>
        </div>
        <div className="mt-6 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Name</TableHead>
                <TableHead className="w-2/5 pl-8">Email</TableHead>
                <TableHead className="pl-14">status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitedGroupAdmins.map(({ name, email }, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell className="pl-8">{email}</TableCell>
                  <TableCell className="pl-14">invited</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
