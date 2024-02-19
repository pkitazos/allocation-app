"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flag, Tag } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { useInstanceParams } from "@/components/params-context";
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

import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { nullable } from "@/lib/utils/general/nullable";

const FormSchema = z.object({
  title: z.string().min(4, "Please enter a longer title"),
  description: z.string().min(10, "Please enter a longer description"),
  flagIds: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one flag for a project.",
  }),
  tags: z
    .array(z.object({ id: z.string(), title: z.string() }))
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one tag for a project.",
    }),
  capacityUpperBound: z.coerce.number().int().positive().optional(),
  preAllocatedStudentId: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export function CreateProjectForm({
  flags,
  tags,
  students,
}: {
  flags: Pick<Flag, "id" | "title">[];
  tags: TagType[];
  students: { id: string }[];
}) {
  const params = useInstanceParams();
  const router = useRouter();
  const instancePath = formatParamsAsPath(params);

  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [preAllocated, setPreAllocated] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      capacityUpperBound: 1,
      flagIds: [],
      tags: [],
    },
  });

  const { mutateAsync } = api.user.supervisor.createProject.useMutation();

  const onSubmit = (data: FormData) => {
    void toast.promise(
      mutateAsync({
        params,
        ...data,
        capacityUpperBound: !preAllocated
          ? nullable(data.capacityUpperBound)
          : 1,
        preAllocatedStudentId: preAllocated
          ? nullable(data.preAllocatedStudentId)
          : null,
      }).then(() => router.push(`${instancePath}/my-projects`)),
      {
        loading: "Creating Project...",
        error: "Something went wrong",
        success: "Success",
      },
    );
    console.log(data.flagIds);
  };

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
              <FormItem>
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

        <div className="mb-3 flex items-center space-x-2">
          <Switch
            id="airplane-mode"
            onCheckedChange={() => setPreAllocated(!preAllocated)}
          />
          <Label htmlFor="airplane-mode">Student defined project</Label>
        </div>

        <div className="grid grid-cols-2">
          <FormField
            control={form.control}
            name="capacityUpperBound"
            disabled={preAllocated}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    "text-xl",
                    preAllocated && "text-muted-foreground",
                  )}
                >
                  Capacity Upper Bound
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-16"
                    placeholder="1"
                    defaultValue={field.value}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The maximum number this project is suitable for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preAllocatedStudentId"
            disabled={!preAllocated}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel
                  className={cn(
                    "text-xl",
                    !preAllocated && "text-muted-foreground",
                  )}
                >
                  Student
                </FormLabel>
                <Popover>
                  <PopoverTrigger disabled={!preAllocated} asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between overflow-hidden",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? students.find(
                              (student) => student.id === field.value,
                            )?.id
                          : "Enter Student ID"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search student..." />
                      <CommandEmpty>No Student found.</CommandEmpty>
                      <CommandGroup>
                        {students.map((student) => (
                          <CommandItem
                            className="overflow-hidden"
                            value={student.id}
                            key={student.id}
                            onSelect={() => {
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
                <FormDescription>
                  This is the student which self-defined this project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-14" />
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            create new project
          </Button>
        </div>
      </form>
    </Form>
  );
}
