"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { api } from "@/lib/trpc/client";
import { GroupParams } from "@/lib/validations/params";

const NewAdminSchema = z.object({
  name: z.string(),
  schoolId: z.string(),
  email: z.string().email(),
});

type NewAdmin = z.infer<typeof NewAdminSchema>;

export function FormButton({ params }: { params: GroupParams }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const form = useForm<NewAdmin>({
    resolver: zodResolver(NewAdminSchema),
  });

  const { mutateAsync } = api.institution.group.addAdmin.useMutation();

  const onSubmit = async (data: NewAdmin) => {
    void toast.promise(
      mutateAsync({ params, ...data }).then(() => {
        form.reset();
        setOpen(false);
        router.refresh();
      }),
      {
        loading: "Making user a Group Admin...",
        error: "Something went wrong",
        success: "Success",
      },
    );

    // run mutation
    // if user with that id exists set that user as the admin, otherwise create new user and set them to be the admin
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-3">
          <Plus className="h-4 w-4" />
          <p>add Group Admin</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl underline decoration-secondary underline-offset-2">
            New Group Admin
          </DialogTitle>
          <DialogDescription>
            Add the details of the user to be the new Admin
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex flex-col gap-6"
          >
            <div className="flex flex-col items-start gap-3">
              <FormField
                control={form.control}
                name="schoolId"
                render={({ field }) => (
                  <FormItem className="grid w-full grid-cols-3 items-center gap-3">
                    <FormLabel className="col-span-1 text-lg">GUID</FormLabel>
                    <FormControl className="col-span-2 flex items-center">
                      <Input placeholder="GUID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid w-full grid-cols-3 gap-3">
                    <FormLabel className="col-span-1 text-lg">Name</FormLabel>
                    <FormControl className="col-span-2">
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        if the user exists we'll add them as an admin
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid w-full grid-cols-3 gap-3">
                    <FormLabel className="col-span-1 text-lg">Email</FormLabel>
                    <FormControl className="col-span-2">
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        if the user exists we'll add them as an admin
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add user to Group</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
