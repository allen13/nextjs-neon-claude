"use client";

import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react/ui";
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
        redirectTo="/dashboard"
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
