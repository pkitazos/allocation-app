import * as z from "zod"
import { Role } from "@prisma/client"

export const InvitationModel = z.object({
  userEmail: z.string(),
  role: z.nativeEnum(Role),
  signUpCode: z.string(),
})
