import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-4 w-90" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <div className="space-y-3 rounded-lg border p-4" key={i}>
              <Skeleton className="h-4 w-25" />
              <Skeleton className="h-8 w-30" />
            </div>
          ))}
      </div>
      <div className="space-y-4 rounded-lg border p-4">
        <Skeleton className="h-8 w-60" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-9/10" />
          <Skeleton className="h-4 w-85/100" />
        </div>
      </div>
      <div className="rounded-lg border">
        <div className="p-4">
          <Skeleton className="h-8 w-30" />
        </div>
        <div className="space-y-4 p-4">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <div className="flex items-center justify-between" key={i}>
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-30" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
