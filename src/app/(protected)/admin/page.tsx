import { Plus } from "lucide-react";
import Link from "next/link";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { api } from "@/lib/trpc/server";

export default async function Page() {
  const { superAdmin, groups } = await api.institution.groupManagement.query();

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
              <TableRow className="flex w-full items-center">
                <TableCell className="w-full font-medium">
                  {superAdmin.name}
                </TableCell>
                <TableCell className="w-full text-start">
                  {superAdmin.email}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <h2 className="text-3xl font-medium leading-none tracking-tight underline decoration-secondary underline-offset-4">
        Manage Allocation Groups{" "}
      </h2>
      <div className="flex w-full flex-col gap-6">
        <Link href="/admin/create-group" className="w-fit">
          <Button
            size="lg"
            variant="outline"
            className="flex h-20 w-full items-center justify-center gap-3 rounded-lg bg-accent/60 hover:bg-accent"
          >
            <Plus className="h-6 w-6 stroke-[3px]" />{" "}
            <p className="text-lg">Create Group</p>
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
