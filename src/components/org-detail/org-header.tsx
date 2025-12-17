"use client";

import { Building2, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OrgHeaderProps {
  name: string;
  slug: string;
  logo?: string | null;
}

export function OrgHeader({ name, slug, logo }: OrgHeaderProps) {
  return (
    <div className="flex items-center gap-4 border-b pb-4">
      <Link href="/org">
        <Button variant="ghost" size="icon" className="shrink-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          {logo ? (
            <Image
              src={logo}
              alt={name}
              width={40}
              height={40}
              className="rounded"
            />
          ) : (
            <Building2 className="h-6 w-6 text-primary" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold">{name}</h1>
          <p className="text-sm text-muted-foreground">@{slug}</p>
        </div>
      </div>
    </div>
  );
}
