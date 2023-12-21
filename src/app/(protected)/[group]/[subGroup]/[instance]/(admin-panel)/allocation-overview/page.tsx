import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/trpc/server";

export default async function Page({
  params: { group: groupId, subGroup: subGroupId, instance: instanceId },
}: {
  params: { group: string; subGroup: string; instance: string };
}) {
  const { byStudent, byProject, bySupervisor } =
    await api.institution.instance.getProjectAllocations.query({
      groupId,
      subGroupId,
      instanceId,
    });

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="flex flex-col gap-3">
        <h2 className="mb-6 text-2xl font-semibold">Final Allocation</h2>
        <Tabs defaultValue="student">
          <TabsList className="w-full">
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="student"
            >
              By Student
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="project"
            >
              By Project
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="supervisor"
            >
              By Supervisor
            </TabsTrigger>
          </TabsList>
          <Separator className="my-4" />
          <TabsContent value="student">
            <StudentsAllocationTable data={byStudent} />
          </TabsContent>
          <TabsContent value="project">
            <ProjectsAllocationTable data={byProject} />
          </TabsContent>
          <TabsContent value="supervisor">
            <SupervisorsAllocationTable data={bySupervisor} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StudentsAllocationTable({
  data,
}: {
  data: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    projectId: string;
    supervisorName: string;
  }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center font-semibold">
            Student ID
          </TableHead>
          <TableHead className="text-center font-semibold">
            Student Name
          </TableHead>
          <TableHead className="text-center font-semibold">
            Student Email
          </TableHead>
          <TableHead className="text-center font-semibold">
            Project ID
          </TableHead>
          <TableHead className="text-center font-semibold">
            Supervisor Name
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(
          (
            { studentId, studentEmail, studentName, projectId, supervisorName },
            i,
          ) => (
            <TableRow key={i}>
              <TableCell className="text-center">{studentId}</TableCell>
              <TableCell className="text-center">{studentName}</TableCell>
              <TableCell className="text-center">{studentEmail}</TableCell>
              <TableCell className="text-center">{projectId}</TableCell>
              <TableCell className="text-center">{supervisorName}</TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </Table>
  );
}

function ProjectsAllocationTable({
  data,
}: {
  data: {
    projectId: string;
    projectTitle: string;
    studentId: string;
    supervisorId: string;
    supervisorName: string;
  }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center font-semibold">
            Project ID
          </TableHead>
          <TableHead className="text-center font-semibold">
            Project Title
          </TableHead>
          <TableHead className="text-center font-semibold">
            Student ID
          </TableHead>
          <TableHead className="text-center font-semibold">
            Supervisor ID
          </TableHead>
          <TableHead className="text-center font-semibold">
            Supervisor Name
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(
          (
            {
              projectId,
              projectTitle,
              studentId,
              supervisorId,
              supervisorName,
            },
            i,
          ) => (
            <TableRow key={i}>
              <TableCell className="text-center">{projectId}</TableCell>
              <TableCell className="text-center">{projectTitle}</TableCell>
              <TableCell className="text-center">{studentId}</TableCell>
              <TableCell className="text-center">{supervisorId}</TableCell>
              <TableCell className="text-center">{supervisorName}</TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </Table>
  );
}

function SupervisorsAllocationTable({
  data,
}: {
  data: {
    supervisorId: string;
    supervisorName: string;
    supervisorEmail: string;
    projectId: string;
    projectTitle: string;
    studentId: string;
  }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center font-semibold">
            Supervisor ID
          </TableHead>
          <TableHead className="text-center font-semibold">
            Supervisor Name
          </TableHead>
          <TableHead className="text-center font-semibold">
            Supervisor Email
          </TableHead>
          <TableHead className="text-center font-semibold">
            Project ID
          </TableHead>
          <TableHead className="text-center font-semibold">
            Project Title
          </TableHead>
          <TableHead className="text-center font-semibold">
            Student ID
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(
          (
            {
              projectId,
              projectTitle,
              studentId,
              supervisorId,
              supervisorName,
              supervisorEmail,
            },
            i,
          ) => (
            <TableRow key={i}>
              <TableCell className="text-center">{supervisorId}</TableCell>
              <TableCell className="text-center">{supervisorName}</TableCell>
              <TableCell className="text-center">{supervisorEmail}</TableCell>
              <TableCell className="text-center">{projectId}</TableCell>
              <TableCell className="text-center">{projectTitle}</TableCell>
              <TableCell className="text-center">{studentId}</TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </Table>
  );
}
