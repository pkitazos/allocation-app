"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role, Stage, type Tag } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import { TagInput, type TagType } from "@/components/tag/tag-input";
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
import { MoreInformation } from "@/components/ui/more-information";
import { NoteCard } from "@/components/ui/note-card";
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
  buildUpdatedProjectSchema,
  type CurrentProjectFormDetails,
  type FormInternalData,
  type UpdatedProject,
} from "@/lib/validations/project-form";

import { AccessControl } from "./access-control";
import { useInstancePath } from "./params-context";

import { spacesLabels } from "@/content/spaces";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(
  () => import("./markdown-editor").then((mod) => mod.MarkdownEditor),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  },
);

export function ProjectForm({
  formInternalData: { takenTitles, flags, tags, students },
  submissionButtonLabel,
  project,
  onSubmit,
  isForked = false,
  requiredFlags,
  children: dismissalButton,
}: {
  formInternalData: FormInternalData;
  submissionButtonLabel: string;
  onSubmit: (data: UpdatedProject) => void;
  project?: CurrentProjectFormDetails;
  isForked?: boolean;
  requiredFlags: string[];
  children: ReactNode;
}) {
  const instancePath = useInstancePath();
  const formProject = {
    title: project?.title ?? "",
    description: project?.description ?? "",
    capacityUpperBound: project?.capacityUpperBound ?? 1,
    preAllocatedStudentId: project?.preAllocatedStudentId ?? "",
    isPreAllocated: project?.isPreAllocated ?? false,
    specialTechnicalRequirements: project?.specialTechnicalRequirements ?? "",
    flagTitles: project?.flagTitles ?? [],
    tags: project?.tags ?? [],
  };

  const preAllocatedStudentId = formProject.preAllocatedStudentId;
  const [selectedTags, setSelectedTags] = useState<TagType[]>(formProject.tags);
  const [preAllocatedSwitchControl, setPreAllocatedSwitchControl] = useState(
    preAllocatedStudentId !== "",
  );

  const form = useForm<UpdatedProject>({
    resolver: zodResolver(
      buildUpdatedProjectSchema(takenTitles, requiredFlags),
    ),
    defaultValues: {
      title: formProject.title,
      description: formProject.description,
      capacityUpperBound: formProject.capacityUpperBound,
      preAllocatedStudentId: formProject.preAllocatedStudentId,
      specialTechnicalRequirements: formProject.specialTechnicalRequirements,
      flagTitles: formProject.flagTitles,
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
                <MarkdownEditor
                  {...field}
                  textareaProps={{
                    placeholder: "Type the project description here.",
                  }}
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
        <FormField
          control={form.control}
          name="specialTechnicalRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl">
                Special Technical Requirements
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type the project technical requirements here."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please add any special technical requirements for this project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="mt-4" />
        {isForked && (
          <NoteCard>
            You are in a forked {spacesLabels.instance.short}. Any new flags or
            keywords assigned to a project will be carried over to the parent{" "}
            {spacesLabels.instance.short}, and any flags or keywords removed
            will remain on the project in the parent{" "}
            {spacesLabels.instance.short} when merging.
          </NoteCard>
        )}
        <div className="grid grid-cols-2">
          <FormField
            control={form.control}
            name="flagTitles"
            render={() => (
              <FormItem className={cn(flags.length === 0 && "hidden")}>
                <div className="mb-3">
                  <FormLabel className="inline-flex items-center gap-2 text-2xl">
                    Flags
                    <MoreInformation>
                      <ul>
                        <li>You must select at least one flag with a level.</li>
                        <li>You can select more than one flag.</li>
                      </ul>
                    </MoreInformation>
                  </FormLabel>
                  <FormDescription className="flex items-center gap-1">
                    <p>
                      Select which students this project is suitable. You can
                      select more than one flag.
                    </p>
                  </FormDescription>
                </div>
                {flags.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="flagTitles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.title)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.title])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.title,
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
                  <FormLabel className="text-2xl">Keywords</FormLabel>
                  <FormDescription>
                    Select the keywords that describe this project
                  </FormDescription>
                </div>
                <FormControl className="w-full">
                  <TagInput
                    placeholder="Enter a keyword"
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
        {isForked && (
          <NoteCard>
            You are in a forked {spacesLabels.instance.short}. Any changes made
            to project capacity will override previous project capacity.
          </NoteCard>
        )}
        <AccessControl
          allowedStages={[Stage.PROJECT_SUBMISSION]}
          allowedRoles={[Role.SUPERVISOR]}
        >
          <NoteCard>
            Only toggle the below switch if the project has been self-defined by
            a student. Otherwise, you can submit the project.
          </NoteCard>
        </AccessControl>
        <AccessControl
          allowedStages={[Stage.PROJECT_SUBMISSION]}
          allowedRoles={[Role.ADMIN, Role.SUPERVISOR]}
        >
          <FormField
            control={form.control}
            name="isPreAllocated"
            render={() => (
              <FormItem className="mb-3 flex items-center space-x-2">
                <FormControl>
                  <div className="flex items-center justify-start gap-2">
                    <Switch
                      id="pre-allocated-student-id"
                      checked={preAllocatedSwitchControl}
                      onCheckedChange={handleSwitch}
                    />
                    <Label htmlFor="pre-allocated-student-id">
                      Student defined project
                    </Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccessControl>

        <div className="flex justify-between">
          <AccessControl
            allowedRoles={[Role.ADMIN]}
            allowedStages={[Stage.PROJECT_SUBMISSION, Stage.PROJECT_SELECTION]}
          >
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
                    className={cn(
                      preAllocatedSwitchControl && "text-slate-400",
                    )}
                  >
                    The maximum number this project is suitable for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </AccessControl>
          <AccessControl allowedStages={[Stage.PROJECT_SUBMISSION]}>
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
                    <PopoverTrigger
                      disabled={!preAllocatedSwitchControl}
                      asChild
                    >
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
                            ? "Enter Student GUID"
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
                    className={cn(
                      !preAllocatedSwitchControl && "text-slate-400",
                    )}
                  >
                    This is the student which self-defined this project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </AccessControl>
        </div>

        <div className="mt-16 flex justify-end gap-8">
          {project && (
            <Button type="button" size="lg" variant="outline" asChild>
              <Link
                className="w-32"
                href={`${instancePath}/projects/${project.id}`}
              >
                Cancel
              </Link>
            </Button>
          )}
          {dismissalButton}
          <Button type="submit" size="lg">
            {submissionButtonLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
