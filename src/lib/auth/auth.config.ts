import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";
import { env } from "@/env";

export default {
  providers: [
    Google,
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
        // Add logic here to look up the user from the credentials supplied
        const admin = {
          id: "clslxtw4e0006oydunnjze3v8",
          name: "Admin",
          email: "subgroup.allocationapp@gmail.com",
        };

        const supervisor = {
          id: "clslxu3f20009oydujlbb7vat",
          name: "Supervisor",
          email: "supervisor.allocationapp@gmail.com",
        };

        const student = {
          id: "clslxu8v7000coydue3gb0mux",
          name: "Student",
          email: "student.allocationapp@gmail.com",
        };

        if (
          username === "admin" &&
          password === env.EVALUATION_SUB_GROUP_ADMIN_PASSWORD
        )
          return admin;
        if (
          username === "supervisor" &&
          password === env.EVALUATION_SUPERVISOR_PASSWORD
        )
          return supervisor;
        if (
          username === "student" &&
          password === env.EVALUATION_STUDENT_PASSWORD
        )
          return student;
        else return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
