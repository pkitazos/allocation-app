import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    SERVER_URL: z.string(),
    ID_KEY: z.string(),
    // optional
    DEV_ENV: z.string().optional(),

    DEV_A_ID: z.string(),
    DEV_A_EMAIL: z.string(),

    DEV_P_ID: z.string(),
    DEV_P_EMAIL: z.string(),
  },
  runtimeEnv: process.env,
});
