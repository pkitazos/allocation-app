import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
    SERVER_URL: z.string(),

    EVALUATION_SUB_GROUP_ADMIN_PASSWORD: z.string(),
    EVALUATION_SUPERVISOR_PASSWORD: z.string(),
    EVALUATION_STUDENT_PASSWORD: z.string(),
  },
  runtimeEnv: process.env,
});
