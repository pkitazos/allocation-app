import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Header } from "@/components/header";
import { SessionProvider } from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";

import { TRPCReactProvider } from "@/lib/trpc/client";

import "@/styles/globals.css";
import { slim_auth } from "@/lib/auth";

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
  const user = await slim_auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <Header />
            <main className="flex h-[92dvh] flex-col justify-start gap-4 bg-background">
              <Breadcrumbs />
              <section className="mx-auto flex h-full w-full max-w-7xl justify-center pb-32 pt-6 3xl:max-w-9xl">
                {children}
              </section>
            </main>
            <Toaster position="bottom-right" />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
