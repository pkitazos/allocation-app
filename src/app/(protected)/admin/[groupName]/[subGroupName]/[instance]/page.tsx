"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AddStudents,
  AddSupervisors,
  Algorithms,
  StageControl,
} from "./(tabs)";

export default function Page() {
  return (
    <Tabs defaultValue="stage-control" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="stage-control">Stage Control</TabsTrigger>
        <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
        <TabsTrigger value="add-supervisors">Add Supervisors</TabsTrigger>
        <TabsTrigger value="add-students">Add Students</TabsTrigger>
      </TabsList>
      <TabsContent value="stage-control" className="mt-28">
        <StageControl />
      </TabsContent>
      <TabsContent value="algorithms" className="mt-28">
        <Algorithms />
      </TabsContent>
      <TabsContent value="add-supervisors" className="mt-28">
        <AddSupervisors />
      </TabsContent>
      <TabsContent value="add-students" className="mt-28">
        <AddStudents />
      </TabsContent>
    </Tabs>
  );
}
