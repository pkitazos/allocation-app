"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  capacityUpperBound: z.number().int().positive(),
});

type FormData = z.infer<typeof FormSchema>;

export function CreateProjectForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      capacityUpperBound: 1,
    },
  });

  const onSubmit = (data: FormData) => {
    void toast.promise(async () => {}, {
      loading: "Loading",
      error: "Something went wrong",
      success: "Success",
    });
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
              <FormLabel className="text-2xl">Project Title</FormLabel>
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
              <FormLabel className="text-2xl">Project Description</FormLabel>
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
        <FormField
          control={form.control}
          name="capacityUpperBound"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl">Capacity Upper Bound</FormLabel>
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
