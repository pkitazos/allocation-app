"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

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
          <TabsTrigger value="dev-setup">Dev</TabsTrigger>
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
            <h3 className="text-xl font-medium underline underline-offset-2 decoration-2">
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
            <h3 className="mt-6 text-xl font-medium underline underline-offset-2 decoration-2">
              this is normally not here
            </h3>

            <Button
              variant="default"
              onClick={() => toggleAdmin(true)}
              className="bg-lime-500 hover:bg-lime-500/90"
            >
              make me admin
            </Button>
            <Button variant="destructive" onClick={() => toggleAdmin(false)}>
              unmake me admin
            </Button>
            {/* <Button
              variant="default"
              onClick={() => toggleSuperAdmin(true)}
              className="bg-lime-500 hover:bg-lime-500/90"
            >
              make me super-admin
            </Button>
            <Button
              variant="destructive"
              onClick={() => toggleSuperAdmin(false)}
            >
              unmake me super-admin
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
