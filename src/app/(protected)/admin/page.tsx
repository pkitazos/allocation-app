import { Plus } from "lucide-react";
import Link from "next/link";

import { Heading, SubHeading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { api } from "@/lib/trpc/server";

import { spacesLabels } from "@/content/spaces";

export default async function Page() {
  const { superAdmins, groups } = await api.institution.groupManagement();

  return (
    <div className="mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <Heading>University of Glasgow</Heading>
      <Card className="my-10 flex flex-col gap-2 ">
        <CardHeader className="-mb-3 mt-3">
          <CardTitle>Super-Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="flex items-center gap-5">
            <TableBody className="w-full text-base">
              {superAdmins.map((admin) => (
                <TableRow className="flex w-full items-center" key={admin.id}>
                  <TableCell className="w-full font-medium">
                    {admin.name}
                  </TableCell>
                  <TableCell className="w-full text-start">
                    {admin.email}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <SubHeading>Manage {spacesLabels.group.full}s</SubHeading>
      <div className="flex w-full flex-col gap-6">
        <Link href="/admin/create-group" className="w-fit">
          <Button
            size="lg"
            variant="outline"
            className="flex h-20 w-full items-center justify-center gap-3 rounded-lg bg-accent/60 hover:bg-accent"
          >
            <Plus className="h-6 w-6 stroke-[3px]" />{" "}
            <p className="text-lg">Create {spacesLabels.group.short}</p>
          </Button>
        </Link>
        <div className="grid w-full grid-cols-3 gap-6">
          {groups.map((group, i) => (
            <Link className="col-span-1" href={`/${group.id}`} key={i}>
              <Button
                className="h-20 w-full text-base font-semibold"
                variant="outline"
                size="lg"
              >
                {group.displayName}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
