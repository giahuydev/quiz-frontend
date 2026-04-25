// File: quiz-frontend/components/ui/spinner.tsx
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center py-12", className)}>
      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}