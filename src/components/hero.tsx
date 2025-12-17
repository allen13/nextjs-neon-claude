import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-screen-xl flex-col items-center gap-8 px-4 py-24 text-center sm:px-6 md:py-32 lg:px-8">
      <Badge variant="secondary" className="gap-2">
        <span className="text-muted-foreground">Introducing</span>
        Next.js Starter Template
      </Badge>

      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        Build beautiful apps{" "}
        <span className="text-muted-foreground">faster than ever</span>
      </h1>

      <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
        A modern Next.js starter template with shadcn/ui, Tailwind CSS, and
        everything you need to ship your next project.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/docs">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </a>
        </Button>
      </div>
    </section>
  );
}
