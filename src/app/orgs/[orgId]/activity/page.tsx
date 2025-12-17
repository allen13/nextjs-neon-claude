"use client";

import { Clock } from "lucide-react";
import { use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from "@/hooks/use-organization";

export default function OrgActivityPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = use(params);
  const { organization, loading } = useOrganization(orgId);

  if (loading || !organization) {
    return null; // Layout handles loading state
  }

  // Generate activity from member data (join dates)
  const members = organization.members || [];
  const activities = members
    .map((member) => ({
      id: member.id,
      type: "member_joined" as const,
      user: member.user,
      role: member.role,
      timestamp: member.createdAt,
    }))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Activity</h2>
        <p className="text-sm text-muted-foreground">
          Recent activity in your organization
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="py-8 text-center">
              <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.image || undefined} />
                    <AvatarFallback>
                      {activity.user.name?.[0] ||
                        activity.user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">
                        {activity.user.name || activity.user.email}
                      </span>{" "}
                      joined as{" "}
                      <span className="capitalize">{activity.role}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
