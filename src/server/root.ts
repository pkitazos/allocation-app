import { institutionRouter } from "./routers/institution";
import { projectRouter } from "./routers/project";
import { userRouter } from "./routers/user";
import { createCallerFactory, createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  user: userRouter,
  institution: institutionRouter,
  test: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session) {
      return { user: undefined };
    } else {
      return { user: ctx.session.user };
    }
  }),
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
