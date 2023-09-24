"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const FormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
});

export default function AdminPanel() {
  const createAllocationGroup = () => {
    fetch("/api/admin/allocation-group", { method: "POST" });
  };

  const createAllocationInstance = () => {
    fetch("/api/admin/allocation-instance", { method: "POST" });
  };

  const createSupervisors = () => {
    fetch("/api/admin/supervisors", { method: "POST" });
  };

  const createFlags = () => {
    fetch("/api/admin/flags", { method: "POST" });
  };

  const createTags = () => {
    fetch("/api/admin/tags", { method: "POST" });
  };

  const createStudents = () => {
    fetch("/api/admin/students", { method: "POST" });
  };

  const createProjects = () => {
    fetch("/api/admin/projects", { method: "POST" });
  };

  const toggleSuperAdmin = (isSuperAdmin: boolean) => {
    fetch("/api/dev/super-admin", {
      method: "PATCH",
      body: JSON.stringify({
        isSuperAdmin,
      }),
    });
  };

  const toggleAdmin = (isAdmin: boolean) => {
    fetch("/api/dev/admin", {
      method: "PATCH",
      body: JSON.stringify({
        isAdmin,
      }),
    });
  };

  const toggleSupervisor = (isSupervisor: boolean) => {
    fetch("/api/dev/supervisor", {
      method: "PATCH",
      body: JSON.stringify({
        isSupervisor,
      }),
    });
  };

  const handleClick = () => {};

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("changed user tier");
  }

  const { user } = useUser();

  if (!user) return;

  const isSuperAdmin = user.publicMetadata.isSuperAdmin as boolean; // TODO: fix type lie

  return (
    <div className="flex flex-col w-2/3 max-w-7xl gap-6 ">
      <div className="flex rounded-md bg-accent py-5 px-6">
        <h1 className="text-5xl text-accent-foreground">Admin Panel</h1>
      </div>
      <Tabs defaultValue="dev-setup" className="w-[400px]">
        <TabsList>
          {isSuperAdmin && <TabsTrigger value="dev-setup">Dev</TabsTrigger>}{" "}
          {isSuperAdmin && (
            <TabsTrigger value="create-admin">Create Admins</TabsTrigger>
          )}
          {isSuperAdmin && (
            <TabsTrigger value="allocation-group">Allocation Group</TabsTrigger>
          )}
          <TabsTrigger value="allocation-instance">
            Allocation Instance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dev-setup">
          <div className="mt-10 flex flex-col gap-2 w-fit">
            <h3 className="text-xl font-medium underline underline-offset-2">
              load mock data
            </h3>
            <Button variant="admin" onClick={createAllocationGroup}>
              create Allocation Group
            </Button>
            <Button variant="admin" onClick={createAllocationInstance}>
              create Allocation Instance
            </Button>
            <Button variant="admin" onClick={createSupervisors}>
              create Supervisors
            </Button>
            <Button variant="admin" onClick={createFlags}>
              create Flags
            </Button>
            <Button variant="admin" onClick={createTags}>
              create Tags
            </Button>
            <Button variant="admin" onClick={createStudents}>
              add Students
            </Button>
            <Button variant="admin" onClick={createProjects}>
              add Projects
            </Button>
            {isSuperAdmin && (
              <>
                <h3 className="text-destructive underline underline-offset-2 mt-6 text-xl font-medium">
                  this is normally not here
                </h3>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-2/3 space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>set user tier</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="super-admin" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  super-admin
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="admin" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  admin
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="supervisor" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  supervisor
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="student" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  student
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="destructive"
                      type="submit"
                      onClick={handleClick}
                    >
                      Submit
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="create-admin">create admins here</TabsContent>
        <TabsContent value="allocation-group">
          create allocation group here
        </TabsContent>
        <TabsContent value="allocation-instance">
          create allocation instance here
        </TabsContent>
      </Tabs>
    </div>
  );
}
