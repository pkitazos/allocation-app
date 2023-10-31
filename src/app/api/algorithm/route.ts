import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const dataSchema = z.object({
  students: z.array(z.array(z.number())),
  projects: z.array(z.array(z.number())),
  lecturers: z.array(z.array(z.number())),
});

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const typedData = dataSchema.parse(data);
  console.log(typedData);

  await fetch("http://127.0.0.1:8000/generous", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(typedData),
  }).catch(() => NextResponse.json({ status: 500, data: "didn't work :(" }));

  return NextResponse.json({ status: 200, data: res });
}
