import mark from "@/assets/retained-mark.png";
import { cn } from "@/lib/utils";

/** The Retained mark: a bowl of rising bars inside a kept-share ring. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src={mark}
      alt="Retained"
      width={816}
      height={816}
      loading="lazy"
      className={cn("size-8 rounded-lg object-contain", className)}
    />
  );
}
