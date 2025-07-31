import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

import Add from "@/app/customer/Add";
import CustomersInfinite from "@/app/customer/CustomersInfinite";
import CustomersSearchResult from "@/app/customer/CustomersSearchResult";
import Search from "@/app/customer/Seaarch";
import { customersSearchQueryOptions } from "@/data/customer";

export const Route = createLazyFileRoute("/_main/_app/companies/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [query, setQuery] = useDebounceValue("", 500);
  const { data, isLoading } = useQuery(customersSearchQueryOptions(query));

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Companies
        </h3>
        <div className="flex gap-2">
          <Add />
        </div>
      </div>
      <Search
        defaultValue=""
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      {data ? (
        <CustomersSearchResult data={data} />
      ) : isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="text-muted-foreground animate-spin" />
        </div>
      ) : (
        <CustomersInfinite />
      )}
    </div>
  );
}
