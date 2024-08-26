"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

import { spacesLabels } from "@/content/spaces";

export function FormSection({
  takenGroupNames,
}: {
  takenGroupNames: string[];
}) {
  const router = useRouter();

  const FormSchema = z.object({
    groupName: z
      .string()
      .min(1, "Please enter a name")
      .refine((item) => {
        const setOfNames = new Set(takenGroupNames);
        const nameAllowed = !setOfNames.has(item);
        return nameAllowed;
      }, "This name is already taken"),
  });

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { groupName: "" },
  });

  const { mutateAsync: createGroupAsync } =
    api.institution.createGroup.useMutation();

  function onSubmit({ groupName }: { groupName: string }) {
    void toast.promise(
      createGroupAsync({ groupName }).then(() => {
        router.push(`/${slugify(groupName)}`);
        router.refresh();
      }),
      {
        loading: `Creating new ${spacesLabels.group.short}...`,
        error: "Something went wrong",
        success: `Successfully created new ${spacesLabels.group.short}`,
      },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col items-center justify-center gap-6"
      >
        <div className="flex w-1/2 flex-col items-start gap-3">
          <FormField
            control={form.control}
            name="groupName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-2xl">
                  {spacesLabels.group.full} Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={`${spacesLabels.group.short} Name`}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please select a unique name for this{" "}
                  {spacesLabels.group.short.toLowerCase()}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-14" />
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Create New {spacesLabels.group.short}
          </Button>
        </div>
      </form>
    </Form>
  );
}
