"use client";
import { Button } from "@/components/ui/button";

export async function ClientSection() {
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
  return (
    <div className="mt-10 flex flex-col gap-2 w-fit">
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
      {/* <Button variant="admin" onClick={() => toast("bro no way")}>
        toast me up
      </Button> */}
    </div>
  );
}
