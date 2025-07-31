import { Image } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonImage() {
  return (
    <div className="relative size-24">
      <Skeleton className="size-full animate-pulse rounded-md">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image className="text-muted-foreground" size={48} />
        </div>
      </Skeleton>
    </div>
  );
}
