"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
}

export interface OrganizationWithMembers {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: Date;
  members: OrganizationMember[];
}

export function useOrganization(orgId: string) {
  const [organization, setOrganization] =
    useState<OrganizationWithMembers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrganization() {
      try {
        setLoading(true);
        // Set the active organization first
        await authClient.organization.setActive({ organizationId: orgId });

        // Get full organization data including members
        const { data, error } =
          await authClient.organization.getFullOrganization();

        if (error) {
          throw new Error(error.message || "Failed to fetch organization");
        }

        setOrganization(data as OrganizationWithMembers);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch organization",
        );
      } finally {
        setLoading(false);
      }
    }

    if (orgId) {
      fetchOrganization();
    }
  }, [orgId]);

  return {
    organization,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
    },
  };
}
