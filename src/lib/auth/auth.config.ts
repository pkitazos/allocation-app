import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import {
  evaluator__student as student,
  evaluator__groupAdmin as groupAdmin,
  evaluator__subGroupAdmin as admin,
  evaluator__supervisor as supervisor,
  superAdmin,
} from "@/lib/db/data";

import { getEvaluatorID } from "./password-decrypt";

import { env } from "@/env";

export default {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ username, password }) {
        if (username === "super-admin" && password === env.ID_KEY)
          return superAdmin;

        const evaluatorID = getEvaluatorID(password);
        if (!evaluatorID) return null;

        if (username === "group-admin") return groupAdmin(evaluatorID);
        if (username === "admin") return admin(evaluatorID);
        if (username === "supervisor") return supervisor(evaluatorID);
        if (username === "student") return student(evaluatorID);
        else return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
