"use client";

import { Settings, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { OrgStats } from "@/components/org-detail/org-stats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from "@/hooks/use-organization";

export default function OrgOverviewPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = use(params);
  const { organization, loading } = useOrganization(orgId);

  if (loading || !organization) {
    return null; // Layout handles loading state
  }

  const members = organization.members || [];

  return (
    <div className="space-y-6">
      <OrgStats
        memberCount={members.length}
        createdAt={organization.createdAt}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href={`/orgs/${orgId}/members`}>
              <Button variant="outline" size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </Link>
            <Link href={`/orgs/${orgId}/settings`}>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Organization Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Members Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Team Members</CardTitle>
            <Link href={`/orgs/${orgId}/members`}>
              <Button variant="ghost" size="sm">
                <Users className="mr-2 h-4 w-4" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No members yet. Invite your team to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {members.slice(0, 5).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user.image || undefined} />
                        <AvatarFallback>
                          {member.user.name?.[0] ||
                            member.user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {member.user.name || member.user.email}
                        </p>
                        {member.user.name && (
                          <p className="text-xs text-muted-foreground">
                            {member.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {member.role}
                    </span>
                  </div>
                ))}
                {members.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    +{members.length - 5} more members
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
