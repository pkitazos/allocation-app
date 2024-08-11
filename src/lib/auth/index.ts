import { User } from "@/lib/validations/auth";
import { getShibUserFromHeaders, retrieveUser } from "./procedures";

export async function auth(): Promise<User | null> {
  const shibUser = await getShibUserFromHeaders();
  return await retrieveUser(shibUser);
}
