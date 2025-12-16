import {
  Zap,
  Palette,
  Moon,
  Blocks,
  Code2,
  Sparkles,
  Terminal,
  Database,
  Rabbit,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Claude Code",
    description:
      "AI-powered development with Claude Code integration for intelligent code generation and assistance.",
    icon: Terminal,
    className: "md:col-span-2",
  },
  {
    title: "Neon Database",
    description:
      "Serverless Postgres with autoscaling, branching, and instant provisioning for modern apps.",
    icon: Database,
    className: "md:col-span-1",
  },
  {
    title: "Bun Runtime",
    description:
      "Blazing fast JavaScript runtime, bundler, and package manager all in one.",
    icon: Rabbit,
    className: "md:col-span-1",
  },
  {
    title: "Lightning Fast",
    description:
      "Built on Next.js with React 19 for blazing fast performance and optimal user experience.",
    icon: Zap,
    className: "md:col-span-1",
  },
  {
    title: "Beautiful Design",
    description:
      "Crafted with shadcn/ui components for a modern, professional look.",
    icon: Palette,
    className: "md:col-span-1",
  },
  {
    title: "Dark Mode",
    description:
      "Seamless dark mode support out of the box with next-themes integration.",
    icon: Moon,
    className: "md:col-span-1",
  },
  {
    title: "Component Library",
    description:
      "Pre-built, accessible components that you can copy and customize to fit your needs.",
    icon: Blocks,
    className: "md:col-span-1",
  },
  {
    title: "TypeScript First",
    description:
      "Full TypeScript support with strict type checking for better developer experience.",
    icon: Code2,
    className: "md:col-span-1",
  },
  {
    title: "Modern Stack",
    description:
      "Tailwind CSS v4 and all the latest tools for modern web development.",
    icon: Sparkles,
    className: "md:col-span-3",
  },
]

export function BentoGrid() {
  return (
    <section id="features" className="mx-auto max-w-screen-xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <Badge variant="outline" className="mb-4">
          Features
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to get started
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A carefully curated set of tools and patterns for modern web development.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className={cn(
              "group relative overflow-hidden transition-all hover:shadow-lg",
              feature.className
            )}
          >
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
