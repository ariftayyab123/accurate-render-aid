import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Phase two</p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Button asChild variant="outline" className="mt-6">
        <Link to="/app">Back to overview</Link>
      </Button>
    </div>
  );
}