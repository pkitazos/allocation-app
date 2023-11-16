import { algorithmRouter } from "./routers/algorithm";
import { institutionRouter } from "./routers/institution";
import { projectRouter } from "./routers/project";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  user: userRouter,
  institution: institutionRouter,
  algorithm: algorithmRouter,
});

export type AppRouter = typeof appRouter;
