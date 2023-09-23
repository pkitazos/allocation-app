import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex justify-center pt-[12dvh] h-[100dvh]">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
