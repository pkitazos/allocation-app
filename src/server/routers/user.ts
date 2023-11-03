import { createTRPCRouter, publicProcedure } from "@/server/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure.query(() => "hello"),
});
