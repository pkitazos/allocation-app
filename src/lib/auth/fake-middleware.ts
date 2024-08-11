import { headers } from "next/headers";
import { z } from "zod";
import { getUserAction } from "./procedures";

// export async function fake_middleware() {
//   // TODO: Replace dummy values with the parsed values from above when running behind shibboleth server
//   // test values for testing while running locally
//   //   const guid = "123456";
//   //   const displayName = "Name from shib";
//   //   const email = "";
//   //   const groups = [];
//   const user = await getUserFromHeaders();

//   const newUser = await getUserAction(user);

//   return newUser;
// }

export async function getUserFromHeaders() {
  // Extract the headers from the request
  const shib_guid = headers().get("DH75HDYT76");
  const shib_displayName = headers().get("DH75HDYT77");
  const shib_groups = headers().get("DH75HDYT78");

  // Log the headers to the console
  console.log(">>> from shibboleth", {
    GUID: shib_guid,
    DisplayName: shib_displayName,
    Groups: shib_groups?.split(";"),
  });

  // Parse the headers into their expected types
  const guid = z.string().parse(shib_guid);
  const displayName = z.string().parse(shib_displayName);
  const email = "test@gmail.com";
  const groups = z.string().parse(shib_groups).split(";");
  return { guid, displayName, email };
}
