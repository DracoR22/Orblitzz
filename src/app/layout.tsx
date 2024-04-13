import { ThemeProvider } from "@/components/providers/next-theme-provider";
import TrpcProviders from "@/components/providers/trpc-provider";
import { cn, constructMetadata } from "@/lib/utils";
import { SessionProvider } from "next-auth/react"

import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { auth } from "@/lib/auth/auth";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/components/providers/modal-provider";
import CrispChat from "@/components/global/crisp-chat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = constructMetadata()

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {

   const session = await auth()

  return (
    <SessionProvider session={session}>
    <html lang="en" suppressHydrationWarning>
      <TrpcProviders>
      <body className={cn('dark:bg-[#1e1e1e] bg-[#ffffff]', inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ModalProvider/>
           {children}
           <Toaster/>
        </ThemeProvider>
      </body>
      </TrpcProviders>
    </html>
    </SessionProvider>
  );
}
