import { getShibUserFromHeaders, retrieveUser } from "./procedures";

export async function auth() {
  const shibUser = await getShibUserFromHeaders();
  return await retrieveUser(shibUser);
}
