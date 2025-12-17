"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { OrgHeader } from "@/components/org-detail/org-header";
import { OrgSidebar } from "@/components/org-detail/org-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { useOrganization } from "@/hooks/use-organization";
import { authClient } from "@/lib/auth/client";

export default function OrgDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { organization, loading, error } = useOrganization(orgId);

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/auth/sign-in");
    }
  }, [session, sessionPending, router]);

  if (sessionPending || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="h-10 w-10 rounded bg-muted" />
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-5 w-32 rounded bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 rounded-lg bg-muted" />
              ))}
            </div>
            <div className="h-96 rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Organization not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <OrgHeader
        name={organization.name}
        slug={organization.slug}
        logo={organization.logo}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <OrgSidebar orgId={orgId} />
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
