import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-screen-xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>

      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
        404
      </h1>

      <p className="mt-2 text-xl text-muted-foreground">Page not found</p>

      <p className="mt-4 max-w-md text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
        have been moved or doesn&apos;t exist.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="#features">View features</Link>
        </Button>
      </div>
    </div>
  );
}
