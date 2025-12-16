import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Starter. All rights reserved.
        </p>

        <nav className="flex items-center gap-6">
          <Link
            href="/docs"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </a>
        </nav>
      </div>
    </footer>
  )
}
