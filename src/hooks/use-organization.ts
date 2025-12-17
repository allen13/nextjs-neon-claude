"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const {
    data: organization,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: async () => {
      // Set the active organization first
      await authClient.organization.setActive({ organizationId: orgId });

      // Get full organization data including members
      const { data, error } =
        await authClient.organization.getFullOrganization();

      if (error) {
        throw new Error(error.message || "Failed to fetch organization");
      }

      return data as OrganizationWithMembers;
    },
    enabled: !!orgId,
  });

  return {
    organization: organization ?? null,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
    },
  };
}
