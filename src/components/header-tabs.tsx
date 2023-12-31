"use client";
import { CompositeUser } from "@/lib/db";
import { Role } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export const accessibleBy = (user: CompositeUser, rolesAllowed: Role[]) => {
  if (!user.role) return false;
  return rolesAllowed.includes(user.role);
};

export function HeaderTabs({
  user,
  adminPanel,
}: {
  user: CompositeUser;
  adminPanel: string;
}) {
  const pathname = usePathname();
  const routes = pathname.split("/");

  const inInstance = routes.length === 4 && routes[3] !== "create-instance";

  // console.log("------------ pathname", { pathname });
  // console.log("------------ routes", { routes });

  return (
    <div className="flex items-center gap-6">
      {inInstance && (
        <>
          {accessibleBy(user, [
            "SUPER_ADMIN",
            "GROUP_ADMIN",
            "SUB_GROUP_ADMIN",
            "SUPERVISOR",
            "STUDENT",
          ]) && (
            <Link className="text-white hover:underline" href="/projects">
              <Button variant="ghost">Projects</Button>
            </Link>
          )}
          {accessibleBy(user, [
            "SUPER_ADMIN",
            "GROUP_ADMIN",
            "SUB_GROUP_ADMIN",
            "SUPERVISOR",
          ]) && (
            <Link className="text-white hover:underline" href="/supervisors">
              <Button variant="ghost">Supervisors</Button>
            </Link>
          )}
          {accessibleBy(user, ["STUDENT"]) && (
            <Link
              className="text-white hover:underline"
              href="/account/my-preferences"
            >
              <Button variant="ghost">My Preferences</Button>
            </Link>
          )}

          {accessibleBy(user, ["SUPERVISOR"]) && (
            <Link
              className="text-white hover:underline"
              href="/account/my-projects"
            >
              <Button variant="ghost">My Projects</Button>
            </Link>
          )}
          {accessibleBy(user, [
            "SUPER_ADMIN",
            "GROUP_ADMIN",
            "SUB_GROUP_ADMIN",
            "SUPERVISOR",
          ]) && (
            <Link className="text-white hover:underline" href="/students">
              <Button variant="ghost">Students</Button>
            </Link>
          )}
        </>
      )}
      {accessibleBy(user, [
        "SUPER_ADMIN",
        "GROUP_ADMIN",
        "SUB_GROUP_ADMIN",
      ]) && (
        <>
          <Link className="text-white hover:underline" href={adminPanel}>
            <Button variant="ghost">Admin Panel</Button>
          </Link>
        </>
      )}
    </div>
  );
}
