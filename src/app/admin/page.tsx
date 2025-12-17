"use client";

import { MoreHorizontal, Search, Shield, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { RoleSelect } from "@/components/admin/role-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/hooks/use-admin";
import { authClient } from "@/lib/auth/client";

interface User {
  id: string;
  name: string | null;
  email: string;
  role?: string;
  createdAt: Date;
  banned?: boolean | null;
}

export default function AdminPage() {
  const router = useRouter();
  const { isAdmin, isPending } = useAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, isPending, router]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await authClient.admin.listUsers({
          query: {
            limit: 50,
            offset: 0,
            ...(searchQuery && {
              searchValue: searchQuery,
              searchField: "email" as const,
              searchOperator: "contains" as const,
            }),
          },
        });
        if (error) throw new Error(error.message || "Failed to fetch users");
        setUsers(data?.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, searchQuery]);

  async function handleRoleChange(userId: string, newRole: string) {
    try {
      // Note: Better Auth admin plugin supports custom roles via server config
      // Cast to expected type - server will validate
      const { error } = await authClient.admin.setRole({
        userId,
        role: newRole as "user" | "admin",
      });
      if (error) throw new Error(error.message || "Failed to update role");
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    }
  }

  async function handleBanUser(userId: string) {
    try {
      const { error } = await authClient.admin.banUser({ userId });
      if (error) throw new Error(error.message || "Failed to ban user");
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, banned: true } : u)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to ban user");
    }
  }

  async function handleUnbanUser(userId: string) {
    try {
      const { error } = await authClient.admin.unbanUser({ userId });
      if (error) throw new Error(error.message || "Failed to unban user");
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, banned: false } : u)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unban user");
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const { error } = await authClient.admin.removeUser({ userId });
      if (error) throw new Error(error.message || "Failed to delete user");
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  }

  function handleUserCreated(user: User) {
    setUsers([user, ...users]);
    setCreateDialogOpen(false);
  }

  if (isPending || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 flex items-center gap-2">
          <Shield className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Users</h1>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/4 rounded bg-muted" />
                    <div className="h-3 w-1/3 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">
              Manage users and their roles
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <div className="relative mt-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No users found
            </p>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">User</th>
                    <th className="p-4 text-left font-medium">Role</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Created</th>
                    <th className="p-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">
                            {user.name || "No name"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <RoleSelect
                          value={user.role || "user"}
                          onValueChange={(role) =>
                            handleRoleChange(user.id, role)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={user.banned ? "destructive" : "secondary"}
                        >
                          {user.banned ? "Banned" : "Active"}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {user.banned ? (
                              <DropdownMenuItem
                                onClick={() => handleUnbanUser(user.id)}
                              >
                                Unban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleBanUser(user.id)}
                              >
                                Ban User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}
