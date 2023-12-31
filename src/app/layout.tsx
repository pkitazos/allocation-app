import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Header } from "@/components/header";
import { SessionProvider } from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TRPCReactProvider } from "@/lib/trpc/client";

import "@/styles/globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Allocation",
  description: "A web app for preference based matching",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // TODO:  change in prod
          disableTransitionOnChange
        >
          <SessionProvider>
            <TRPCReactProvider headers={headers()}>
              <Header />
              <main className="flex h-[92dvh] flex-col justify-start gap-4">
                <Breadcrumbs />
                <section className="mx-auto flex w-full max-w-7xl justify-center pb-40 pt-6 3xl:max-w-9xl">
                  {children}
                </section>
              </main>
              <Toaster position="bottom-right" />
            </TRPCReactProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
