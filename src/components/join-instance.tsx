"use client";

import { Fragment, useEffect } from "react";

import { api } from "@/lib/trpc/client";

import { useInstanceParams } from "./params-context";

export function JoinInstance() {
  const params = useInstanceParams();
  const { mutateAsync } = api.user.joinInstance.useMutation();

  useEffect(() => void mutateAsync({ params }), [mutateAsync, params]);

  return <Fragment />;
}
