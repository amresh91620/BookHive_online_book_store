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
        "inline-flex items-center gap-2 ",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center text-[#F59E0B]",
          iconWrapClassName
        )}
      >
        <BookOpen className="h-6 w-6 stroke-[2.5]" />
      </span>
      <span
        className={cn(
          "text-[1.65rem] font-bold leading-none tracking-tight",
          textClassName
        )}
      >
        <span className="text-[#1F2937]">Book</span>
        <span className="text-[#F59E0B]">Hive</span>
      </span>
    </span>
  );
}

