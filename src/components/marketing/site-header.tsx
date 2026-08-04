import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n";
import type { SiteCopy } from "@/lib/site-copy";

interface Props {
  copy: SiteCopy;
  language: LanguageCode;
  offer: LanguageCode | null;
  onLanguage: (next: LanguageCode) => void;
  onDemo: () => void;
}

export function SiteHeader({ copy, language, offer, onLanguage, onDemo }: Props) {
  const alternate = language === "en" ? offer : "en";

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5 sm:px-8">
        <BrandMark className="size-8" />
        <span className="display text-lg font-semibold tracking-tight">Retained</span>

        <div className="ms-auto flex items-center gap-1.5">
          {alternate ? (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-muted-foreground"
              onClick={() => onLanguage(alternate)}
            >
              {copy.nav.readIn} {LANGUAGES[alternate].native}
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" className="rounded-full" onClick={onDemo}>
            {copy.nav.demo}
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full max-sm:hidden" asChild>
            <Link to="/auth">{copy.nav.signIn}</Link>
          </Button>
          <Button size="sm" className="rounded-full" asChild>
            <Link to="/auth">{copy.nav.create}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
