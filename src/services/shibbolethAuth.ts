import { headers } from "next/headers";

export interface ShibbolethUser {
  guid: string;
  displayName: string;
  groups: string[];
}

export function getShibbolethUser(): ShibbolethUser | null {
  const httpHeaders = headers();
  const guid = httpHeaders.get('DH75HDYT76');
  const displayName = httpHeaders.get('DH75HDYT77');
  const groups = httpHeaders.get('DH75HDYT78')?.split(';') || [];

  console.log(guid)

  if (guid && displayName) {
    return { guid, displayName, groups };
  }
  return null;
}