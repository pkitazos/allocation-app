"use client";
import { useClearance } from "@/app/clearance";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPanel() {
  const [userClearance, recompute] = useClearance();

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

  const setClearance = (clearance: number) => {
    fetch("/api/dev/clearance", {
      method: "PATCH",
      body: JSON.stringify({
        clearance,
      }),
    }).then(() => recompute());
  };

  return (
    <div className="flex w-2/3 max-w-7xl flex-col gap-6 ">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">Admin Panel</h1>
      </div>
      <Tabs defaultValue="dev-setup" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="dev-setup">Dev</TabsTrigger>
          {userClearance === 3 && (
            <TabsTrigger value="create-admin">Create Admins</TabsTrigger>
          )}
          {userClearance === 3 && (
            <TabsTrigger value="allocation-group">Allocation Group</TabsTrigger>
          )}
          {userClearance >= 2 && (
            <TabsTrigger value="allocation-instance">
              Allocation Instance
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="dev-setup">
          <div className="mt-10 flex w-fit flex-col gap-2">
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
            {/* <Button variant="default" onClick={() => setClearance(0)}>
              make me a student
            </Button>
            <Button variant="default" onClick={() => setClearance(1)}>
              make me a supervisor
            </Button>
            <Button variant="default" onClick={() => setClearance(2)}>
              make me an admin
            </Button>
            <Button variant="default" onClick={() => setClearance(3)}>
              make me a super-admin
            </Button> */}
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
