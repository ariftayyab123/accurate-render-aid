import { UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

interface UploadZoneProps {
  title: string;
  description: string;
  accept?: string;
  onFileSelect?: (file: File) => void;
  className?: string;
}

export function UploadZone({
  title,
  description,
  accept = ".csv,.xlsx",
  onFileSelect,
  className,
}: UploadZoneProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 px-6 py-10 transition-colors hover:border-primary hover:bg-accent/30",
        className,
      )}
    >
      <input
        type="file"
        className="absolute inset-0 z-10 cursor-pointer opacity-0"
        accept={accept}
        onChange={handleFileChange}
      />
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <UploadCloud className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 max-w-xs text-center text-xs text-muted-foreground">
        {description}
      </p>
      <div className="mt-4 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-sm">
        Browse files
      </div>
    </div>
  );
}
