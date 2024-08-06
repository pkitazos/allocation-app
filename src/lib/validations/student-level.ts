import { z } from "zod";

export const studentLevelSchema = z.literal(4).or(z.literal(5));
