import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    SERVER_URL: z.string(),
    SITE_URL: z.string(),
    ID_KEY: z.string(),
  },
  runtimeEnv: process.env,
});
