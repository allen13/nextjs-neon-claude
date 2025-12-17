"use client";

import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react/ui";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { authClient } from "@/lib/auth/client";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NeonAuthUIProvider
        authClient={authClient}
        navigate={router.push}
        replace={router.replace}
        redirectTo="/notes"
        onSessionChange={() => {
          // Clear router cache (protected routes)
          router.refresh();
        }}
        emailOTP
      >
        {children}
      </NeonAuthUIProvider>
    </ThemeProvider>
  );
}
