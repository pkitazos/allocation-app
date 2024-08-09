import { headers } from "next/headers";
import { z } from "zod";
import { getUserAction } from "./procedures";

export async function fake_middleware() {
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

  // TODO: Replace dummy values with the parsed values from above when running behind shibboleth server
  // test values for testing while running locally
  //   const guid = "123456";
  //   const displayName = "Name from shib";
  //   const email = "";
  //   const groups = [];

  const newUser = await getUserAction({ guid, displayName, email });

  return newUser;
}
