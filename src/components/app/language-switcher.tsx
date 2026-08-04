import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, type LanguageCode } from "@/lib/i18n";

/** Market-aware language picker (English + Hindi in India, English + Arabic in the UAE). */
export function LanguageSwitcher() {
  const { available, language, option, setLanguage, t } = useI18n();

  if (available.length < 2) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
          <Languages className="size-3.5" />
          <span>{option.native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          {t("top.language")}
        </DropdownMenuLabel>
        {available.map((entry) => (
          <DropdownMenuCheckboxItem
            key={entry.code}
            checked={entry.code === language}
            onCheckedChange={() => setLanguage(entry.code as LanguageCode)}
          >
            {entry.native}
            <span className="ml-auto text-xs text-muted-foreground">{entry.label}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
