"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AlgorithmFlag } from "@prisma/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/trpc/client";
import { algorithmFlagSchema } from "@/lib/validations/algorithm";
import { instanceParams } from "@/lib/validations/params";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

const allFlags = [
  { label: "GRE", value: AlgorithmFlag.GRE },
  { label: "GEN", value: AlgorithmFlag.GEN },
  { label: "LSB", value: AlgorithmFlag.LSB },
  { label: "MAXSIZE", value: AlgorithmFlag.MAXSIZE },
  { label: "MINCOST", value: AlgorithmFlag.MINCOST },
  { label: "MINSQCOST", value: AlgorithmFlag.MINSQCOST },
] as const;

export function NewAlgorithmForm({
  params,
  takenNames,
  setShowForm,
}: {
  params: instanceParams;
  takenNames: string[];
  setShowForm: Dispatch<SetStateAction<boolean>>;
}) {
  const { refresh } = useRouter();
  const { mutateAsync: createAlgorithmAsync } =
    api.institution.instance.createAlgorithm.useMutation();

  // TODO: derive this from existing algorithmSchema
  const FormSchema = z.object({
    algName: z
      .string({
        required_error: "Please select an Algorithm Name",
      })
      .refine((item) => {
        const builtIns = ["Generous", "Greedy", "MinCost", "Greedy-Generous"];
        const allTakenNames = builtIns.concat(takenNames);
        const setOfNames = new Set(allTakenNames);
        return !setOfNames.has(item);
      }, "This name is already taken"),
    flag1: algorithmFlagSchema,
    flag2: algorithmFlagSchema.nullable(),
    flag3: algorithmFlagSchema.nullable(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { algName, flag1, flag2, flag3 } = data;
    toast.promise(
      createAlgorithmAsync({
        params,
        algName,
        flag1,
        flag2,
        flag3,
      })
        .then(() => setShowForm(false))
        .then(refresh),
      {
        loading: "Creating New Algorithm",
        error: "Something went wrong",
        success:
          "You successfully created a new custom Algorithm configuration",
      },
    );
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full items-start justify-between gap-2"
      >
        <FormField
          control={form.control}
          name="algName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Algorithm Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="flag1"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[140px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? allFlags.find((flag) => flag.label === field.value)
                            ?.label
                        : "Select flag"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[140px] p-0">
                  <Command>
                    <CommandInput placeholder="Search flags..." />
                    <CommandEmpty>No flag found.</CommandEmpty>
                    <CommandGroup>
                      {allFlags.map((flag) => (
                        <CommandItem
                          value={flag.value}
                          key={flag.value}
                          onSelect={() => {
                            form.setValue("flag1", flag.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              flag.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {flag.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="flag2"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[140px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? allFlags.find((flag) => flag.label === field.value)
                            ?.label
                        : "Select flag"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[140px] p-0">
                  <Command>
                    <CommandInput placeholder="Search flags..." />
                    <CommandEmpty>No flag found.</CommandEmpty>
                    <CommandGroup>
                      {allFlags.map((flag) => (
                        <CommandItem
                          value={flag.value}
                          key={flag.value}
                          onSelect={() => {
                            form.setValue("flag2", flag.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              flag.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {flag.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="flag3"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[140px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? allFlags.find((flag) => flag.label === field.value)
                            ?.label
                        : "Select flag"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[140px] p-0">
                  <Command>
                    <CommandInput placeholder="Search flags..." />
                    <CommandEmpty>No flag found.</CommandEmpty>
                    <CommandGroup>
                      {allFlags.map((flag) => (
                        <CommandItem
                          value={flag.value}
                          key={flag.value}
                          onSelect={() => {
                            form.setValue("flag3", flag.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              flag.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {flag.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="secondary" type="submit">
          save
        </Button>
      </form>
    </Form>
  );
}
