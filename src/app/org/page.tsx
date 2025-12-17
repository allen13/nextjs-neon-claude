"use client";

import {
  CreateOrganizationDialog,
  OrganizationSwitcher,
} from "@neondatabase/neon-js/auth/react/ui";
import { useQuery } from "@tanstack/react-query";
import { Building2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getOrganizationColumns,
  type Organization,
} from "@/components/organizations/organizations-columns";
import { OrganizationsTable } from "@/components/organizations/organizations-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth/client";

export default function OrganizationsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/auth/sign-in");
    }
  }, [session, sessionPending, router]);

  const {
    data: organizations = [],
    isPending: orgsPending,
    error,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.list();
      if (error)
        throw new Error(error.message || "Failed to fetch organizations");
      return (data || []) as Organization[];
    },
    enabled: !!session,
  });

  const columns = useMemo(() => getOrganizationColumns(), []);

  if (sessionPending || !session || orgsPending) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Organizations</h1>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-10 w-10 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/4 rounded bg-muted" />
                    <div className="h-3 w-1/6 rounded bg-muted" />
                  </div>
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Organizations</h1>
            <p className="text-muted-foreground">
              Manage your organizations and teams
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <OrganizationSwitcher size="icon" />
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/15 p-4 text-destructive">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
      )}

      {organizations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">No organizations yet</h3>
            <p className="mb-4 text-muted-foreground">
              Create your first organization to collaborate with your team.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </CardContent>
        </Card>
      ) : (
        <OrganizationsTable columns={columns} data={organizations} />
      )}

      <CreateOrganizationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
