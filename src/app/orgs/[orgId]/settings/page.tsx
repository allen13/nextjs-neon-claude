"use client";

import {
  DeleteOrganizationCard,
  OrganizationNameCard,
  OrganizationSlugCard,
} from "@neondatabase/neon-js/auth/react/ui";
import { use } from "react";
import { useOrganization } from "@/hooks/use-organization";

export default function OrgSettingsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = use(params);
  const { organization, loading } = useOrganization(orgId);

  if (loading || !organization) {
    return null; // Layout handles loading state
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your organization settings
        </p>
      </div>

      <div className="space-y-6">
        <OrganizationNameCard />
        <OrganizationSlugCard />
        <DeleteOrganizationCard />
      </div>
    </div>
  );
}
