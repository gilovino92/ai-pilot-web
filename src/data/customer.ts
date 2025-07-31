import { queryOptions } from "@tanstack/react-query";

import type { ApiResp, Customer } from "./types";

import { tenant } from "./fetch";

type CreateCustomerBody = {
  address: string;
  company_name: string;
  email: string;
  industry: string;
  notes: string;
  num_employees?: number;
  phone_number: string;
  status: string;
  tax_code: string;
  website: string;
};

export async function createCustomer(body: CreateCustomerBody) {
  const res = await tenant<ApiResp<Customer>>(`tenant-backend/v1/customers`, {
    json: body,
    method: "POST",
  });

  if (res.status !== 200) {
    throw new Error("Failed to create customer");
  }

  const { data } = await res.json();

  return data;
}

export function customerQueryOptions(id: string) {
  return queryOptions({
    queryFn: () => getCustomer(id),
    queryKey: ["customer", id],
  });
}

export function customersQueryOptions() {
  return queryOptions({
    queryFn: () => getCustomers(),
    queryKey: ["customers"],
  });
}

export function customersSearchQueryOptions(query: string) {
  return queryOptions({
    enabled: !!query,
    queryFn: () => searchCustomers(query),
    queryKey: ["customersSearch", query],
  });
}

export async function deleteCustomer(id: string) {
  const res = await tenant<ApiResp<Customer>>(
    `tenant-backend/v1/customers/${id}`,
    {
      method: "DELETE",
    },
  );

  if (res.status !== 200) {
    throw new Error("Failed to delete customer");
  }

  return res.json();
}

export async function getCustomer(id: string) {
  const res = await tenant<ApiResp<Customer>>(
    `tenant-backend/v1/customers/${id}`,
  );

  if (res.status !== 200) {
    throw new Error("Failed to fetch customer");
  }

  const { data } = await res.json();

  return data;
}

export async function getCustomers(page = 1, pageSize = 6) {
  const res = await tenant<ApiResp<Customer[]>>(`tenant-backend/v1/customers`, {
    searchParams: {
      page,
      page_size: pageSize,
    },
  });

  if (res.status !== 200) {
    throw new Error("Failed to fetch customers");
  }

  const { data, meta } = await res.json();

  return { data, meta };
}

export async function searchCustomers(query: string) {
  const res = await tenant<ApiResp<Customer[]>>(
    `tenant-backend/v1/customers/search`,
    {
      searchParams: {
        company_name: query,
      },
    },
  );

  if (res.status !== 200) {
    throw new Error("Failed to search customers");
  }

  const { data } = await res.json();

  return data;
}

export async function updateCustomer(
  body: { id: number } & CreateCustomerBody,
) {
  const res = await tenant<ApiResp<Customer>>(
    `tenant-backend/v1/customers/${body.id}`,
    {
      json: body,
      method: "PUT",
    },
  );

  if (res.status !== 200) {
    throw new Error("Failed to update customer");
  }

  return res.json();
}
