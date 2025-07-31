import type { PaginationState } from "@tanstack/react-table";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useState } from "react";

import type { LeadFilters } from "@/data/types";

import DataTableServerPagination from "@/app/data-table/DataTableServerPagination";
import { columns } from "@/app/prospect/EmployeeColumns";
import { Calendar } from "@/components/cui/calendar";
import { MultiSelect } from "@/components/cui/multi-select";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  employeesQueryOptions,
  leadMetadataQueryOptions,
} from "@/data/prospect";

export const Route = createLazyFileRoute("/_main/_app/prospect/leads")({
  component: RouteComponent,
});

function RouteComponent() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<LeadFilters | undefined>();

  const { data } = useSuspenseQuery(leadMetadataQueryOptions());

  const { data: employees, isFetching } = useQuery(
    employeesQueryOptions(pagination, filters),
  );

  return (
    <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
      <div className="flex h-full min-h-0 flex-col gap-2">
        <div className="min-h-0 flex-1">
          <ScrollArea className="h-full">
            <Collapsible className="mb-2">
              <CollapsibleTrigger asChild>
                <Button className="w-full justify-between" variant="ghost">
                  Name
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                <Input
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Name"
                  value={filters?.name || ""}
                />
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="mb-2">
              <CollapsibleTrigger asChild>
                <Button className="w-full justify-between" variant="ghost">
                  Countries
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                <MultiSelect
                  defaultValue={filters?.countries}
                  maxCount={3}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      countries: value,
                    }))
                  }
                  options={data.countries.map((country) => ({
                    label: country,
                    value: country,
                  }))}
                  placeholder="Select countries"
                  variant="inverted"
                />
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="mb-2">
              <CollapsibleTrigger asChild>
                <Button className="w-full justify-between" variant="ghost">
                  Industries
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                <MultiSelect
                  maxCount={3}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      industries: value,
                    }))
                  }
                  options={data.industries.map((industry) => ({
                    label: industry,
                    value: industry,
                  }))}
                  placeholder="Select industries"
                  variant="inverted"
                />
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="mb-2">
              <CollapsibleTrigger asChild>
                <Button className="w-full justify-between" variant="ghost">
                  Technology
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                <MultiSelect
                  maxCount={3}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      technologies: value,
                    }))
                  }
                  options={data.technologies.map((technology) => ({
                    label: technology,
                    value: technology,
                  }))}
                  placeholder="Select technologies"
                  variant="inverted"
                />
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="mb-2">
              <CollapsibleTrigger asChild>
                <Button className="w-full justify-between" variant="ghost">
                  Job Posting
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                <MultiSelect
                  maxCount={3}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      job_postings: value,
                    }))
                  }
                  options={[]}
                  placeholder="Select job postings"
                  variant="inverted"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="w-full" variant="outline">
                      {filters?.job_posting_date_range?.from &&
                      filters.job_posting_date_range.to ? (
                        `${format(
                          filters.job_posting_date_range.from,
                          "PPP",
                        )} - ${format(filters.job_posting_date_range.to, "PPP")}`
                      ) : (
                        <span className="text-muted-foreground font-normal">
                          Pick a date
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="range"
                      onSelect={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          job_posting_date_range: value,
                        }))
                      }
                      selected={filters?.job_posting_date_range}
                    />
                  </PopoverContent>
                </Popover>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="mb-2">
              <CollapsibleTrigger asChild>
                <Button className="w-full justify-between" variant="ghost">
                  Revenue
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                <Input
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      revenue_min: e.target.value,
                    }))
                  }
                  placeholder="Min"
                  value={filters?.revenue_min || ""}
                />
                <Input
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      revenue_max: e.target.value,
                    }))
                  }
                  placeholder="Max"
                  value={filters?.revenue_max || ""}
                />
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="mb-2">
              <CollapsibleTrigger asChild>
                <Button className="w-full justify-between" variant="ghost">
                  Company
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                <Input placeholder="Name" />
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="mb-2">
              <CollapsibleTrigger asChild>
                <Button className="w-full justify-between" variant="ghost">
                  Company Size
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                <Input
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      company_size_min: e.target.value,
                    }))
                  }
                  placeholder="Min"
                  value={filters?.company_size_min || ""}
                />
                <Input
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      company_size_max: e.target.value,
                    }))
                  }
                  placeholder="Max"
                  value={filters?.company_size_max || ""}
                />
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="mb-2">
              <CollapsibleTrigger asChild>
                <Button className="w-full justify-between" variant="ghost">
                  Founded Year
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                <Input
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      founded_year_min: e.target.value,
                    }))
                  }
                  placeholder="Min"
                  value={filters?.founded_year_min || ""}
                />
                <Input
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      founded_year_max: e.target.value,
                    }))
                  }
                  placeholder="Max"
                  value={filters?.founded_year_max || ""}
                />
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="mb-2">
              <CollapsibleTrigger asChild>
                <Button className="w-full justify-between" variant="ghost">
                  Funding Stages
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                <MultiSelect
                  maxCount={3}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      funding_stages: value,
                    }));
                  }}
                  options={[]}
                  placeholder="Select funding stages"
                  variant="inverted"
                />
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="mb-2">
              <CollapsibleTrigger asChild>
                <Button className="w-full justify-between" variant="ghost">
                  Funding Date
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="w-full" variant="outline">
                      {filters?.funding_date_range?.from &&
                      filters.funding_date_range.to ? (
                        `${format(
                          filters.funding_date_range.from,
                          "PPP",
                        )} - ${format(filters.funding_date_range.to, "PPP")}`
                      ) : (
                        <span className="text-muted-foreground font-normal">
                          Pick a date
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="range"
                      onSelect={(value) => {
                        setFilters((prev) => ({
                          ...prev,
                          funding_date_range: value,
                        }));
                      }}
                      selected={filters?.funding_date_range}
                    />
                  </PopoverContent>
                </Popover>
              </CollapsibleContent>
            </Collapsible>
          </ScrollArea>
        </div>
        <div>
          <Button
            className="w-full"
            onClick={() => {
              setFilters(undefined);
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      </div>
      <div className="bg-muted col-span-2 h-full min-h-0 rounded-md p-2">
        <div className="bg-background">
          <DataTableServerPagination
            columns={columns}
            data={employees?.data || []}
            isFetching={isFetching}
            onPaginationChange={setPagination}
            pagination={pagination}
            rowCount={employees?.meta?.total}
          />
        </div>
      </div>
    </div>
  );
}
