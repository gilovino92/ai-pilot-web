import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Customer from "@/app/customer/Customer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInfiniteCustomers } from "@/data/hooks/company";

export default function CustomersInfinite() {
  const [inViewRef, isInView] = useInView();
  const { data, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteCustomers();

  useEffect(() => {
    if (isInView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching, isInView]);

  return (
    <ScrollArea className="h-full min-h-0">
      <div className="grid h-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {data?.data.map((customer) => (
          <Customer data={customer} key={customer.id} />
        ))}
      </div>
      <div className="h-px w-full" ref={inViewRef} />
    </ScrollArea>
  );
}
