"use client";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const NewAdminSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

type NewAdmin = z.infer<typeof NewAdminSchema>;

export function FormSection() {
  const [invitedGroupAdmins, setInvitedGroupAdmins] = useState<NewAdmin[]>([]);

  const { register, handleSubmit, reset } = useForm<NewAdmin>({
    resolver: zodResolver(NewAdminSchema),
  });

  const onSubmit = (data: NewAdmin) => {
    setInvitedGroupAdmins((prev) => [data, ...prev]);
    reset();
  };

  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="flex flex-col items-start gap-3">
        <h3 className="text-2xl">Allocation Group Name</h3>
        <Input className="w-1/2" placeholder="Group Name" />
      </div>
      <Separator className="my-14" />
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
      <Separator className="my-10" />
      <div className="flex justify-end">
        <Button size="lg">create new group</Button>
      </div>
    </div>
  );
}
