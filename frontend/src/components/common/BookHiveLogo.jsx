import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookHiveLogo({
  className,
  textClassName,
  iconWrapClassName,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d97642] to-[#c26535] text-white shadow-[0_16px_35px_rgba(217,118,66,0.22)]",
          iconWrapClassName
        )}
      >
        <BookOpen className="h-[46%] w-[46%] stroke-[2.35]" />
      </span>
      <span className="flex flex-col">
        <span className="text-[0.63rem] font-semibold uppercase tracking-[0.38em] text-slate-400">
          Curated Shelf
        </span>
        <span
          className={cn(
            "text-[1.55rem] font-semibold leading-none tracking-tight",
            textClassName
          )}
        >
          <span className="text-slate-900">Book</span>
          <span className="text-[#d97642]">Hive</span>
        </span>
      </span>
    </span>
  );
}

