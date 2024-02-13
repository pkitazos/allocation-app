"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/trpc/client";
import { slugify } from "@/lib/utils/general/slugify";

export function FormSection({ takenNames }: { takenNames: string[] }) {
  const router = useRouter();
  const FormSchema = z.object({
    groupName: z
      .string()
      .min(1, "Please enter a name")
      .refine((item) => {
        const setOfNames = new Set(takenNames);
        const nameAllowed = !setOfNames.has(item);
        return nameAllowed;
      }, "This name is already taken"),
  });

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      groupName: "",
    },
  });

  const { mutateAsync: createGroupAsync } =
    api.institution.createGroup.useMutation();

  const onSubmit = ({ groupName }: { groupName: string }) => {
    console.log(groupName);
    void toast.promise(
      createGroupAsync({ groupName }).then(() =>
        router.push(`/${slugify(groupName)}`),
      ),
      {
        loading: "Loading",
        error: "Something went wrong",
        success: "Success",
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col gap-6"
      >
        <div className="flex flex-col items-start gap-3">
          <FormField
            control={form.control}
            name="groupName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl">
                  Allocation Group Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Group Name" {...field} />
                </FormControl>
                <FormDescription>
                  Please select a unique name for this group
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-14" />
        {/* <AdminInviteForm /> */}
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            create new group
          </Button>
        </div>
      </form>
    </Form>
  );
}
