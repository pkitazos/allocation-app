"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ProjectTableDataDto } from "@/lib/validations/dto/project";
import { PreferenceType } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

export function UpdatePreferencesSection({
  availableProjects,
}: {
  availableProjects: ProjectTableDataDto[];
}) {
  type HELLO = {
    projectId: string;
    preferenceType: PreferenceType;
  };

  const my_schema = z.object({
    projectId: z.string(),
    preferenceType: z.nativeEnum(PreferenceType),
  });

  const form = useForm<HELLO>({
    resolver: zodResolver(my_schema),
    defaultValues: {
      preferenceType: PreferenceType.PREFERENCE,
    },
  });

  function onSubmit(data: HELLO) {
    void toast(`${data.preferenceType} - ${data.projectId}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-start gap-10">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem className="flex w-96 flex-col">
                <FormLabel className="text-xl">Project ID</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
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
                          ? "Enter Project ID"
                          : field.value}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] p-0">
                    <Command>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {availableProjects.map((project) => (
                          <CommandItem
                            className="overflow-hidden"
                            value={project.id}
                            key={project.id}
                            onSelect={() => {
                              form.setValue("projectId", project.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                project.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <p> {project.id}</p>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandInput placeholder="Search Project Id..." />
                      <CommandEmpty>No Project found.</CommandEmpty>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the Project you wish to add to this student&apos;s
                  preference list
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferenceType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Choose Preference type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={PreferenceType.PREFERENCE} />
                      </FormControl>
                      <FormLabel className="font-normal">Preference </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={PreferenceType.SHORTLIST} />
                      </FormControl>
                      <FormLabel className="font-normal">Shortlist</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
