"use client";
import { DatePicker } from "@/components/datepicker";
import { Input } from "@/components/input";
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
import { isAfter } from "date-fns";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

export function FormSection({
  takenNames,
  groupSlug,
  subGroupSlug,
}: {
  takenNames: string[];
  groupSlug: string;
  subGroupSlug: string;
}) {
  const router = useRouter();
  const FormSchema = z
    .object({
      instanceName: z
        .string()
        .min(1, "Please enter a name")
        .refine((item) => {
          const setOfNames = new Set(takenNames);
          return !setOfNames.has(item);
        }, "This name is already taken"),
      minNumProjects: z.number().int().positive(),
      maxNumProjects: z.number().int(),
      projectUploadDeadline: z
        .date()
        .refine((item) => isAfter(item, new Date())),
      minNumPreferences: z.number().int().positive(),
      maxNumPreferences: z.number().int(),
      maxNumPerSupervisor: z.number().int().positive(),
      preferenceSubmissionDeadline: z.date(),
    })
    .refine(
      ({ minNumProjects, maxNumProjects }) => minNumProjects <= maxNumProjects,
      {
        message:
          "Maximum Number of Projects can't be less than Minimum Number of Projects",
        path: ["maxNumProjects"],
      },
    )
    .refine(
      ({ minNumPreferences, maxNumPreferences }) =>
        minNumPreferences <= maxNumPreferences,
      {
        message:
          "Maximum Number of Preferences can't be less than Minimum Number of Preferences",
        path: ["maxNumPreferences"],
      },
    )
    .refine(
      ({ maxNumPreferences, maxNumPerSupervisor }) =>
        maxNumPreferences <= maxNumPerSupervisor,
      {
        message:
          "Maximum Number of Preferences per supervisor can't be more than Maximum Number of Preferences",
        path: ["maxNumPerSupervisor"],
      },
    )
    .refine(
      ({ projectUploadDeadline, preferenceSubmissionDeadline }) =>
        isAfter(preferenceSubmissionDeadline, projectUploadDeadline),
      {
        message:
          "Preference Submission deadline can't be before Project Upload deadline",
        path: ["preferenceSubmissionDeadline"],
      },
    );

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      instanceName: "",
    },
  });

  const { mutateAsync: createInstanceAsync } =
    api.institution.subGroup.createInstance.useMutation();

  const onSubmit = ({ instanceName }: { instanceName: string }) => {
    console.log(instanceName);
    void toast.promise(
      createInstanceAsync({
        groupSlug,
        subGroupSlug,
        name: instanceName,
      }).then(() =>
        router.push(`/${groupSlug}/${subGroupSlug}/${slugify(instanceName)}`),
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
            name="instanceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl">
                  Allocation Instance Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Instance Name" {...field} />
                </FormControl>
                <FormDescription>
                  Please select a unique name within the group and sub-group for
                  this instance
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-14" />
        <h3 className="text-2xl">Project Restrictions</h3>
        <form className="flex flex-col gap-2">
          <p>Add Project Flags</p>
          <div className="flex gap-4">
            <Input className="w-1/3" placeholder="Flag" />
            <Button size="icon" type="button">
              <Plus />
            </Button>
          </div>
        </form>
        <form className="flex flex-col gap-2">
          <p>Add Project Tags</p>
          <div className="flex gap-4">
            <Input className="w-1/3" placeholder="Tag" />
            <Button size="icon" type="button">
              <Plus />
            </Button>
          </div>
        </form>
        <Separator className="my-14" />
        <h3 className="text-2xl">Supervisor Restrictions</h3>
        <form className="grid w-1/2 grid-cols-2 gap-5">
          {/* TODO: handle submit on debounce */}
          <p className="place-self-end self-center">
            Minimum number of Projects:
          </p>
          <FormField
            control={form.control}
            name="minNumProjects"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-10 self-center"
                    placeholder="1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="place-self-end self-center">
            Maximum number of Projects:
          </p>
          <FormField
            control={form.control}
            name="maxNumProjects"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-10 self-center"
                    placeholder="1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="place-self-end self-center">Project upload deadline:</p>
          <FormField
            control={form.control}
            name="projectUploadDeadline"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker className="self-center" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        <Separator className="my-14" />
        <h3 className="text-2xl">Student Restrictions</h3>
        <form className="grid w-1/2 grid-cols-2 gap-5">
          <p className="place-self-end self-center">
            Minimum number of Preferences:
          </p>
          <FormField
            control={form.control}
            name="minNumPreferences"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-10 self-center"
                    placeholder="1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="place-self-end self-center">
            Maximum number of Preferences:
          </p>
          <FormField
            control={form.control}
            name="maxNumPreferences"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-10 self-center"
                    placeholder="1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="place-self-end self-center">per Supervisor:</p>
          <FormField
            control={form.control}
            name="maxNumPerSupervisor"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-10 self-center"
                    placeholder="1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="place-self-end self-center">
            Preference submission deadline:
          </p>
          <FormField
            control={form.control}
            name="preferenceSubmissionDeadline"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker className="self-center" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        <Separator className="my-10" />
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            create new instance
          </Button>
        </div>
      </form>
    </Form>
  );
}
