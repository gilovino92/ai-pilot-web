import type { PaginationState } from "@tanstack/react-table";

import { queryOptions } from "@tanstack/react-query";
import qs from "qs";

import type {
  ApiResp,
  LeadCompany,
  LeadEmployee,
  LeadFilters,
  LeadMetadata,
} from "./types";

import { prospect } from "./fetch";

export function companiesQueryOptions(
  paging: PaginationState,
  filters?: LeadFilters,
) {
  return queryOptions({
    enabled: !!filters,
    queryFn: () => getCompanies(paging, filters),
    queryKey: ["leadCompanies", paging, filters],
  });
}

export function employeesQueryOptions(
  paging: PaginationState,
  filters?: LeadFilters,
) {
  return queryOptions({
    enabled: !!filters,
    queryFn: () => getEmployees(paging, filters),
    queryKey: ["leadEmployees", paging, filters],
  });
}

export async function getCompanies(
  paging: PaginationState,
  filters?: LeadFilters,
) {
  const params = filters
    ? {
        company_name: filters.company,
        company_size_max: filters.company_size_max,
        company_size_min: filters.company_size_min,
        countries: filters.countries,
        founded_year_end: filters.founded_year_max,
        founded_year_start: filters.founded_year_min,
        funding_date_range: undefined,
        funding_stages: filters.funding_stages,
        industries: filters.industries,
        job_posting_date_range: undefined,
        job_postings: filters.job_postings,
        page: paging.pageIndex + 1,
        page_size: paging.pageSize,
        q: filters.name,
        retail_location_max: filters.retail_location_max,
        retail_location_min: filters.retail_location_min,
        revenue_end: filters.revenue_max,
        revenue_start: filters.revenue_min,
        technologies: filters.technologies,
      }
    : undefined;
  const res = await prospect<ApiResp<LeadCompany[]>>(
    `lead-sourcing/v1/companies`,
    {
      searchParams: qs.stringify(params, { arrayFormat: "repeat" }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to get companies!");
  }

  const { data, meta } = await res.json();

  return { data, meta };
}

export async function getEmployees(
  paging: PaginationState,
  filters?: LeadFilters,
) {
  const params = filters
    ? {
        company_name: filters.company,
        company_size_max: filters.company_size_max,
        company_size_min: filters.company_size_min,
        countries: filters.countries,
        founded_year_end: filters.founded_year_max,
        founded_year_start: filters.founded_year_min,
        funding_date_range: undefined,
        funding_stages: filters.funding_stages,
        industries: filters.industries,
        job_posting_date_range: undefined,
        job_postings: filters.job_postings,
        page: paging.pageIndex + 1,
        page_size: paging.pageSize,
        q: filters.name,
        revenue_end: filters.revenue_max,
        revenue_start: filters.revenue_min,
        technologies: filters.technologies,
      }
    : undefined;
  const res = await prospect<ApiResp<LeadEmployee[]>>(
    `lead-sourcing/v1/employees`,
    {
      searchParams: qs.stringify(params, { arrayFormat: "repeat" }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to get employees!");
  }

  const { data, meta } = await res.json();

  return { data, meta };
}

export async function getLeadMetadata() {
  const res = await prospect<ApiResp<LeadMetadata>>(
    `lead-sourcing/v1/meta-data`,
  );

  if (!res.ok) {
    throw new Error("Failed to get lead metadata!");
  }

  const { data } = await res.json();

  return data;
}

export function leadMetadataQueryOptions() {
  return queryOptions({
    queryFn: () => getLeadMetadata(),
    queryKey: ["leadMetadata"],
    staleTime: Infinity,
  });
}
