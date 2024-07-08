"use client";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";

import { TagInput, TagType } from "@/components/tag/tag-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import {
  CurrentProjectFormDetails,
  FormInternalData,
  UpdatedProject,
  updatedProjectSchema,
} from "@/lib/validations/project-form";

export function ProjectForm({
  formInternalData: { flags, tags, students },
  submissionButtonLabel,
  project,
  onSubmit,
  children: dismissalButton,
}: {
  formInternalData: FormInternalData;
  submissionButtonLabel: string;
  onSubmit: (data: UpdatedProject) => void;
  project?: CurrentProjectFormDetails;
  children: ReactNode;
}) {
  const formProject = {
    title: project?.title ?? "",
    description: project?.description ?? "",
    capacityUpperBound: project?.capacityUpperBound ?? 1,
    preAllocatedStudentId: project?.preAllocatedStudentId ?? "",
    isPreAllocated: project?.isPreAllocated ?? false,
    flagIds: project?.flagIds ?? [],
    tags: project?.tags ?? [],
  };

  const preAllocatedStudentId = formProject.preAllocatedStudentId;
  const [selectedTags, setSelectedTags] = useState<TagType[]>(formProject.tags);
  const [preAllocatedSwitchControl, setPreAllocatedSwitchControl] = useState(
    preAllocatedStudentId !== "",
  );

  const form = useForm<UpdatedProject>({
    resolver: zodResolver(updatedProjectSchema),
    defaultValues: {
      title: formProject.title,
      description: formProject.description,
      capacityUpperBound: formProject.capacityUpperBound,
      preAllocatedStudentId: formProject.preAllocatedStudentId,
      flagIds: formProject.flagIds,
      tags: formProject.tags,
    },
  });

  function handleSwitch() {
    const newState = !preAllocatedSwitchControl;

    if (newState) {
      form.setValue("capacityUpperBound", 1);
    } else {
      form.setValue("preAllocatedStudentId", "");
    }

    form.setValue("isPreAllocated", newState);
    setPreAllocatedSwitchControl(newState);
  }

  const availableStudents =
    preAllocatedStudentId !== ""
      ? [{ id: preAllocatedStudentId }, ...students]
      : students;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex w-full max-w-5xl flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl">Title</FormLabel>
              <FormControl>
                <Input placeholder="Project Title" {...field} />
              </FormControl>
              <FormDescription>
                Please insert a title for this project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type the project description here."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please add a description for this project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="mt-4" />
        <div className="grid grid-cols-2">
          <FormField
            control={form.control}
            name="flagIds"
            render={() => (
              <FormItem className={cn(flags.length === 0 && "hidden")}>
                <div className="mb-3">
                  <FormLabel className="text-2xl">Flags</FormLabel>
                  <FormDescription>
                    Select which students this project is suitable
                  </FormDescription>
                </div>
                {flags.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="flagIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id,
                                      ),
                                    );
                              }}
                              {...field.ref}
                            />
                          </FormControl>
                          <FormLabel className="text-base font-normal">
                            {item.title}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <div className="mb-1">
                  <FormLabel className="text-2xl">Tags</FormLabel>
                  <FormDescription>
                    Select the tags that describe this project
                  </FormDescription>
                </div>
                <FormControl className="w-full">
                  <TagInput
                    placeholder="Enter a tag"
                    autocompleteOptions={tags}
                    tags={selectedTags}
                    inputFieldPosition="top"
                    setTags={(newTags) => {
                      setSelectedTags(newTags);
                      form.setValue("tags", newTags as [Tag, ...Tag[]]);
                    }}
                    className="sm:min-w-[450px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-4" />

        <FormField
          control={form.control}
          name="isPreAllocated"
          render={() => (
            <FormItem className="mb-3 flex items-center space-x-2">
              <FormControl>
                <>
                  <Switch
                    id="pre-allocated-student-id"
                    checked={preAllocatedSwitchControl}
                    onCheckedChange={handleSwitch}
                  />
                  <Label htmlFor="pre-allocated-student-id">
                    Student defined project
                  </Label>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2">
          <FormField
            control={form.control}
            name="capacityUpperBound"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    "text-xl",
                    preAllocatedSwitchControl && "text-slate-400",
                  )}
                >
                  Capacity Upper Bound
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={preAllocatedSwitchControl}
                    className="w-16"
                    placeholder="1"
                    {...field}
                  />
                </FormControl>
                <FormDescription
                  className={cn(preAllocatedSwitchControl && "text-slate-400")}
                >
                  The maximum number this project is suitable for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preAllocatedStudentId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel
                  className={cn(
                    "text-xl",
                    !preAllocatedSwitchControl && "text-slate-400",
                  )}
                >
                  Student
                </FormLabel>
                <Popover>
                  <PopoverTrigger disabled={!preAllocatedSwitchControl} asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between overflow-hidden",
                          !field.value && "text-slate-400",
                        )}
                      >
                        {field.value === "" || !field.value
                          ? "Enter Student ID"
                          : field.value}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search student..."
                        disabled={!preAllocatedSwitchControl}
                      />
                      <CommandEmpty>No Student found.</CommandEmpty>
                      <CommandGroup>
                        {availableStudents.map((student) => (
                          <CommandItem
                            className="overflow-hidden"
                            value={student.id}
                            key={student.id}
                            onSelect={() => {
                              setPreAllocatedSwitchControl(true);
                              form.setValue(
                                "preAllocatedStudentId",
                                student.id,
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                student.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {student.id}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription
                  className={cn(!preAllocatedSwitchControl && "text-slate-400")}
                >
                  This is the student which self-defined this project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-14" />
        <div className="flex justify-end gap-8">
          {dismissalButton}
          <Button type="submit" size="lg">
            {submissionButtonLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
