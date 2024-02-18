"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flag, Tag } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  flagIds: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one flag for a project.",
  }),
  tags: z.array(z.object({ id: z.string(), title: z.string() })),
  capacityUpperBound: z.number().int().positive(),
  preAllocatedStudent: z.string().nullable(),
});

type FormData = z.infer<typeof FormSchema>;

export function CreateProjectForm({
  flags,
  students,
}: {
  flags: Pick<Flag, "id" | "title">[];
  tags: Pick<Tag, "id" | "title">[];
  students: { id: string }[];
}) {
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

  const onSubmit = (data: FormData) => {
    void toast.promise(async () => {}, {
      loading: "Loading",
      error: "Something went wrong",
      success: "Success",
    });
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
          {/* <FancyMultiSelect tags={tags} /> */}
        </div>

        <Separator className="my-4" />
        <div>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Student defined project</Label>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <FormField
            control={form.control}
            name="preAllocatedStudent"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xl">Student</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
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
                            value={student.id}
                            key={student.id}
                            onSelect={() => {
                              form.setValue("preAllocatedStudent", student.id);
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
          <FormField
            control={form.control}
            name="capacityUpperBound"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Capacity Upper Bound</FormLabel>
                <FormControl>
                  <Input placeholder="1" {...field} />
                </FormControl>
                <FormDescription>
                  Please insert the maximum number this project is suitable for
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
