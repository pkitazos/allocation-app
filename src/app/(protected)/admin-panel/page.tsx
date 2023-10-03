"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPanel() {
  return (
    <div className="flex w-2/3 max-w-7xl flex-col gap-6 ">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">Admin Panel</h1>
      </div>
      <Tabs defaultValue="allocation-instance" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="create-admin">Create Admins</TabsTrigger>

          <TabsTrigger value="allocation-group">Allocation Group</TabsTrigger>

          <TabsTrigger value="allocation-instance">
            Allocation Instance
          </TabsTrigger>
        </TabsList>
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
