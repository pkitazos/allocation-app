"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addHours, format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { SubHeading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { UpdatedInstance } from "@/lib/validations/instance-form";
import { InstanceParams } from "@/lib/validations/params";

import { buildFormSchema } from "./form-schema";

import { spacesLabels } from "@/content/space-labels";
import { ReactNode } from "react";
import { deadlineHandler } from "@/lib/utils/date/deadline-handler";

export function FormSection({
  currentInstanceDetails,
  takenNames,
  params,
  children: dismissalButton,
}: {
  currentInstanceDetails: UpdatedInstance;
  takenNames: string[];
  params: InstanceParams;
  children: ReactNode;
}) {
  const { group, subGroup, instance } = params;
  const router = useRouter();

  const FormSchema = buildFormSchema(takenNames);

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: currentInstanceDetails,
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

  const { mutateAsync: editInstanceAsync } =
    api.institution.instance.edit.useMutation();

  async function onSubmit(updatedInstance: FormData) {
    void toast.promise(
      editInstanceAsync({
        params,
        updatedInstance: {
          ...updatedInstance,
          displayName: updatedInstance.instanceName,
          minPreferences: updatedInstance.minNumPreferences,
          maxPreferences: updatedInstance.maxNumPreferences,
          maxPreferencesPerSupervisor: updatedInstance.maxNumPerSupervisor,
        },
      }).then(() => {
        router.push(`/${group}/${subGroup}/${instance}`);
        router.refresh();
      }),
      {
        loading: `Updating ${spacesLabels.instance.short} Details...`,
        error: "Something went wrong",
        success: `Successfully updated ${spacesLabels.instance.short} Details`,
      },
    );
  }

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
        <SubHeading className="text-2xl">Project Details</SubHeading>
        <div className="grid w-full grid-cols-2">
          <div className="flex flex-col gap-2">
            <FormLabel className="text-base">Project Flags</FormLabel>
            <FormDescription>
              What kind of student is this project suitable for
            </FormDescription>
            {flagFields.map((item, idx) => (
              <FormField
                key={item.id}
                control={form.control}
                name="flags"
                render={() => (
                  <FormItem className="w-80">
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Flag"
                          {...form.register(`flags.${idx}.title`)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={flagFields.length === 1}
                          onClick={() => removeFlag(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.flags?.[idx]?.title?.message ?? ""}
                    </p>
                  </FormItem>
                )}
              />
            ))}
            <Button
              className="flex w-80 items-center gap-2"
              variant="outline"
              type="button"
              onClick={() => appendFlag({ title: "" })}
            >
              <Plus />
              <p>Add new Flag</p>
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <FormLabel className="text-base">Project Tags</FormLabel>
            <FormDescription>
              A starting selection of tags Supervisors can use to label their
              projects
            </FormDescription>
            {tagFields.map((item, idx) => (
              <FormField
                key={item.id}
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem className="w-80">
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Tag"
                          {...form.register(`tags.${idx}.title`)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={tagFields.length === 1}
                          onClick={() => removeTag(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.tags?.[idx]?.title?.message ?? ""}
                    </p>
                  </FormItem>
                )}
              />
            ))}
            <Button
              className="flex w-80 items-center gap-2"
              variant="outline"
              type="button"
              onClick={() => appendTag({ title: "" })}
            >
              <Plus />
              <p>Add new Tag</p>
            </Button>
          </div>
        </div>
        <Separator className="my-14" />
        <SubHeading className="text-2xl">Supervisor Restrictions</SubHeading>
        <FormField
          control={form.control}
          name="projectSubmissionDeadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-base">
                Project Submission deadline
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (!date) return;
                      const actualDate = deadlineHandler(date);
                      field.onChange(actualDate);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The last day supervisors will be able to submit their projects
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-14" />
        <SubHeading className="text-2xl">Student Restrictions</SubHeading>
        <div className="grid w-full grid-cols-2">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="minNumPreferences"
              render={({ field }) => (
                <FormItem className="w-96">
                  <div className="flex items-center justify-between gap-4">
                    <FormLabel className="text-base">
                      Minimum number of Preferences:
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-20 text-center"
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxNumPreferences"
              render={({ field }) => (
                <FormItem className="w-96">
                  <div className="flex items-center justify-between gap-4">
                    <FormLabel className="text-base">
                      Maximum number of Preferences:
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-20 text-center"
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxNumPerSupervisor"
              render={({ field }) => (
                <FormItem className="w-96">
                  <div className="flex items-center justify-between gap-4">
                    <FormLabel className="text-base">per Supervisor:</FormLabel>
                    <FormControl>
                      <Input
                        className="w-20 text-center"
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    The maximum number of projects belonging to the same
                    supervisor a student is able to select
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="preferenceSubmissionDeadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">
                  Preference Submission deadline
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (!date) return;
                        const actualDate = deadlineHandler(date);
                        field.onChange(actualDate);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The last day students will be able to submit their preference
                  list
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-10" />
        <div className="flex justify-end gap-8">
          {dismissalButton}
          <Button type="submit" size="lg" onClick={() => {}}>
            Update {spacesLabels.instance.short}
          </Button>
        </div>
      </form>
    </Form>
  );
}
