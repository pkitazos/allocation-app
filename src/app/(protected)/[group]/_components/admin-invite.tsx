// ! might be out of date
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const NewAdminSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

type NewAdmin = z.infer<typeof NewAdminSchema>;

export function AdminInvite() {
  const [invitedGroupAdmins, setInvitedGroupAdmins] = useState<NewAdmin[]>([]);

  const { register, handleSubmit, reset } = useForm<NewAdmin>({
    resolver: zodResolver(NewAdminSchema),
  });

  const onSubmit = async (data: NewAdmin) => {
    setInvitedGroupAdmins((prev) => [data, ...prev]);
    reset();
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-3"
      >
        <h3 className="text-2xl">Add Allocation Group Admins</h3>
        <div className="flex w-full items-center justify-start gap-5">
          <Input className="w-1/3" placeholder="Name" {...register("name")} />
          <Input className="w-2/5" placeholder="Email" {...register("email")} />
          <Button variant="secondary">save</Button>
        </div>
      </form>
      <div className="mt-6 w-full">
        <Table>
          <TableBody>
            {invitedGroupAdmins.map(({ name, email }, i) => (
              <TableRow key={i} className="w-full">
                <TableCell className="w-1/3">{name}</TableCell>
                <TableCell className="pl-8">{email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
