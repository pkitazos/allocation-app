import { AdminLevel } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { permissionCheck } from "@/lib/utils/permissions/permission-check";

import { AdminRemovalButton } from "./_components/admin-removal-button";
import { DangerZone } from "./_components/danger-zone";
import { FormButton } from "./_components/form-button";

export default async function Page({
  params,
}: {
  params: { group: string; subGroup: string };
}) {
  const access = await api.institution.subGroup.access({ params });

  if (!access) {
    return (
      <Unauthorised message="You need to be an admin to access this page" />
    );
  }

  const { subGroupAdmins, allocationInstances, displayName, adminLevel } =
    await api.institution.subGroup.instanceManagement({ params });

  const { group, subGroup } = params;

  return (
    <div className="mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <Heading>{displayName}</Heading>
      <Card className="my-10 flex flex-col gap-2">
        <CardHeader className="-mb-3 mt-3">
          <CardTitle>Sub-Group Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="flex items-center gap-5">
            <TableBody className="w-full text-base">
              {subGroupAdmins.map(({ user: { id, name, email } }, i) => (
                <TableRow className="flex w-full items-center" key={i}>
                  <TableCell className="w-1/3 font-medium">{name}</TableCell>
                  <TableCell className="w-1/3 text-start">{email}</TableCell>
                  {permissionCheck(adminLevel, AdminLevel.GROUP) && (
                    <TableCell className="flex w-1/3 justify-end">
                      <AdminRemovalButton userId={id} params={params} />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-2">
            <FormButton params={params} />
          </div>
        </CardContent>
      </Card>

      <h2 className="text-3xl font-medium leading-none tracking-tight underline decoration-secondary underline-offset-4">
        Manage Allocation Instances
      </h2>
      <div className="flex w-full flex-col gap-6">
        <Link href={`/${group}/${subGroup}/create-instance`} className="w-fit">
          <Button
            size="lg"
            variant="outline"
            className="flex h-20 w-full items-center justify-center gap-3 rounded-lg bg-accent/60 hover:bg-accent"
          >
            <Plus className="h-6 w-6 stroke-[3px]" />
            <p className="text-lg">Create Instance</p>
          </Button>
        </Link>
        <div className="grid grid-cols-3 gap-6">
          {allocationInstances.map((instance, i) => (
            <Link
              className="col-span-1 flex"
              href={`/${group}/${subGroup}/${instance.id}`}
              key={i}
            >
              <Button
                className="h-20 w-full text-base font-semibold"
                variant="outline"
                size="lg"
              >
                {instance.displayName}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      {permissionCheck(adminLevel, AdminLevel.GROUP) && (
        <div className="mt-16">
          <DangerZone spaceTitle="Sub-Group" params={params} />
        </div>
      )}
    </div>
  );
}
