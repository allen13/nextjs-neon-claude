"use client";

import { Eye, Shield, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roles = [
  {
    value: "user",
    label: "User",
    description: "Standard user access",
    icon: User,
  },
  {
    value: "moderator",
    label: "Moderator",
    description: "Can view all notes",
    icon: Eye,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Full administrative access",
    icon: Shield,
  },
];

interface RoleSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function RoleSelect({
  value,
  onValueChange,
  disabled,
}: RoleSelectProps) {
  const currentRole = roles.find((r) => r.value === value) || roles[0];
  const Icon = currentRole.icon;

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {currentRole.label}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            <div className="flex items-center gap-2">
              <role.icon className="h-4 w-4" />
              <div>
                <div className="font-medium">{role.label}</div>
                <div className="text-xs text-muted-foreground">
                  {role.description}
                </div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
