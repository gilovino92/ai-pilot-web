import type { Customer as TCustomer } from "@/data/types";

import { ScrollArea } from "@/components/cui/scroll-area";

import Customer from "./Customer";

type CustomersSearchResultProps = {
  data: TCustomer[];
};

export default function CustomersSearchResult({
  data,
}: CustomersSearchResultProps) {
  return (
    <div className="min-h-0 flex-1">
      <ScrollArea className="h-full min-h-0">
        <div className="grid h-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {data.map((customer) => (
            <Customer data={customer} key={customer.id} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
