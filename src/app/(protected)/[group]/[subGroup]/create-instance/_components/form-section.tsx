"use client";
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
import { SubGroupParams } from "@/lib/validations/params";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function FormSection({
  takenNames,
  params,
}: {
  takenNames: string[];
  params: SubGroupParams;
}) {
  // TODO: needs major refactor

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
      flags: z.array(
        z.object({ flag: z.string().min(1, "Please add a flag") }),
      ),
      tags: z.array(z.object({ tag: z.string().min(1, "Please add a tag") })),
      minNumProjects: z.coerce.number().int().positive(),
      maxNumProjects: z.coerce.number().int().positive(),
      // projectUploadDeadline: z
      //   .date()
      //   .refine(
      //     (item) => isAfter(item, new Date()),
      //     "Project Upload deadline can't be today",
      //   ),
      minNumPreferences: z.coerce.number().int().positive(),
      maxNumPreferences: z.coerce.number().int().positive(),
      maxNumPerSupervisor: z.coerce.number().int().positive(),
      // preferenceSubmissionDeadline: z.date(),
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
        maxNumPreferences >= maxNumPerSupervisor,
      {
        message:
          "Maximum Number of Preferences per supervisor can't be more than Maximum Number of Preferences",
        path: ["maxNumPerSupervisor"],
      },
    )
    // .refine(
    //   ({ projectUploadDeadline, preferenceSubmissionDeadline }) =>
    //     isAfter(preferenceSubmissionDeadline, projectUploadDeadline),
    //   {
    //     message:
    //       "Preference Submission deadline can't be before Project Upload deadline",
    //     path: ["preferenceSubmissionDeadline"],
    //   },
    // )
    .refine(
      ({ flags }) => {
        const flagSet = new Set(flags);
        return flags.length === flagSet.size;
      },
      {
        message: "Flags must have distinct values",
        path: ["flags.0.flag"],
      },
    );

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      instanceName: "",
      flags: [{ flag: "" }],
      tags: [{ tag: "" }],
      minNumProjects: 0,
      maxNumProjects: 0,
      // projectUploadDeadline: new Date(),
      minNumPreferences: 0,
      maxNumPreferences: 0,
      maxNumPerSupervisor: 0,
      // preferenceSubmissionDeadline: new Date(),
    },
  });
  const {
    fields: flagFields,
    append: appendFlag,
    remove: removeFlag,
  } = useFieldArray({
    control: form.control,
    name: "flags",
    rules: {
      required: "Please add at least 1 Flag",
      validate: (array) => array.length !== 0,
    },
  });
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const { mutateAsync: createInstanceAsync } =
    api.institution.subGroup.createInstance.useMutation();

  const onSubmit = async ({ ...formData }: FormData) => {
    console.log(formData);
    console.log("boom");
    void toast.promise(
      createInstanceAsync({
        params,
        name: formData.instanceName,
      }).then(() => router.push(`/${params.group}/${params.subGroup}`)),
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
        <div className="flex flex-col gap-2">
          <p>Add Project Flags</p>
          <div className="flex w-1/3 flex-col gap-2">
            <Button
              size="icon"
              type="button"
              onClick={() => appendFlag({ flag: "" })}
            >
              <Plus />
            </Button>
            {flagFields.map((item, idx) => (
              <FormField
                key={item.id}
                control={form.control}
                name="flags"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Flag"
                          {...form.register(`flags.${idx}.flag`)}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFlag(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Add Project Tags</p>
          <div className="flex w-1/3 flex-col gap-2">
            <Button
              size="icon"
              type="button"
              onClick={() => appendTag({ tag: "" })}
            >
              <Plus />
            </Button>
            {tagFields.map((item, idx) => (
              <FormField
                key={item.id}
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Tag"
                          {...form.register(`tags.${idx}.tag`)}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeTag(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
        <Separator className="my-14" />
        <h3 className="text-2xl">Supervisor Restrictions</h3>
        <div className="grid w-1/2 grid-cols-2 gap-5">
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
          {/* <p className="place-self-end self-center">Project upload deadline:</p>
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
          /> */}
        </div>
        <Separator className="my-14" />
        <h3 className="text-2xl">Student Restrictions</h3>
        <div className="grid w-1/2 grid-cols-2 gap-5">
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
          {/* <p className="place-self-end self-center">
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
          /> */}
        </div>
        <Separator className="my-10" />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            onClick={() => console.log(form.formState.errors)}
          >
            create new instance
          </Button>
        </div>
      </form>
    </Form>
  );
}
