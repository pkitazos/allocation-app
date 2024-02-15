import { headers } from "next/headers";

import { InstanceParams } from "@/lib/validations/params";

export async function getSpaceParams() {
  const headersList = headers();

  const domain = headersList.get("host") || "";
  const fullUrl = headersList.get("referer") || "";

  const [, end] = getStartEnd(fullUrl, domain);

  const routes = fullUrl.slice(end + 1).split("/");
  const inInstance =
    routes.length >= 4 &&
    routes[3] !== "create-instance" &&
    routes[0] !== "api";

  const spaceParams = inInstance
    ? generateParams(routes.slice(1, 4))
    : ({} as InstanceParams);

  return { inInstance, spaceParams };
}

const getStartEnd = (str: string, sub: string) => [
  str.indexOf(sub),
  str.indexOf(sub) + sub.length - 1,
];

const generateParams = (hello: string[]) => {
  return {
    group: hello[0],
    subGroup: hello[1],
    instance: hello[2],
  };
};
