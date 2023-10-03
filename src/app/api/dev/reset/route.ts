import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE() {
  console.log("RESET");
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  await prisma
    .$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
    .catch((error) => NextResponse.json({ status: 500, data: error }));

  console.log("ok");
  console.log("RESET COMPLETE");
  return NextResponse.json({ status: 200, data: "success" });
}
