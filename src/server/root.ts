import { projectRouter } from "./routers/project";
import { studentRouter } from "./routers/student";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  student: studentRouter,
});

export type AppRouter = typeof appRouter;
