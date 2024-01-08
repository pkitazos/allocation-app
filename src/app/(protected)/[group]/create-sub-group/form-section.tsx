"use client";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/trpc/client";
import { slugify } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { toast } from "sonner";

export function FormSection({
  takenNames,
  allocationGroupId,
}: {
  takenNames: string[];
  allocationGroupId: string;
}) {
  const router = useRouter();
  const FormSchema = z.object({
    subGroupName: z
      .string()
      .min(1, "Please enter a name")
      .refine((item) => {
        const setOfNames = new Set(takenNames);
        return !setOfNames.has(item);
      }, "This name is already taken"),
  });

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subGroupName: "",
    },
  });

  const { mutateAsync: createSubGroupAsync } =
    api.institution.group.createSubGroup.useMutation();

  const onSubmit = ({ subGroupName }: { subGroupName: string }) => {
    console.log(subGroupName);
    void toast.promise(
      createSubGroupAsync({
        groupId: allocationGroupId,
        name: subGroupName,
      }).then(() =>
        router.push(`/${allocationGroupId}/${slugify(subGroupName)}`),
      ),
      {
        loading: "Loading",
        error: "Something went wrong",
        success: "Succcess",
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
            name="subGroupName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl">
                  Allocation Sub-Group Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Sub-Group Name" {...field} />
                </FormControl>
                <FormDescription>
                  Please select a unique name within the group for this
                  sub-group
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-14" />
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            create new sub-group
          </Button>
        </div>
      </form>
    </Form>
  );
}
