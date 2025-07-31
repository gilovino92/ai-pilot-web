import { queryOptions } from "@tanstack/react-query";

import type { ApiResp, Document, DocumentUpload, DocumentUrl } from "./types";

import { tenant } from "./fetch";

export async function deleteDocument(id: number) {
  const res = await tenant<ApiResp<null>>(
    `tenant-backend/v1/admin/org-documents/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to delete document!");
  }

  const { data } = await res.json();

  return data;
}

export function documentsQueryOptions() {
  return queryOptions({
    queryFn: () => getDocuments(),
    queryKey: ["documents"],
  });
}

export async function getDocuments() {
  const res = await tenant<ApiResp<Document[]>>(
    `tenant-backend/v1/admin/org-documents/`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch documents!");
  }

  const { data } = await res.json();

  return data;
}

export async function getDocumentUrl(key: string) {
  const res = await tenant<ApiResp<DocumentUrl>>(
    `tenant-backend/v1/admin/documents/url`,
    {
      searchParams: {
        key,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch document url!");
  }

  const { data } = await res.json();

  return data;
}

export async function uploadDocument(file: File) {
  const fd = new FormData();
  fd.append("file", file);

  const resUpload = await tenant<ApiResp<DocumentUpload>>(
    `tenant-backend/v1/admin/documents/upload`,
    {
      body: fd,
      method: "POST",
    },
  );

  if (!resUpload.ok) {
    throw new Error("Failed to upload document!");
  }

  const { data: upload } = await resUpload.json();

  const res = await tenant<ApiResp<Document>>(
    `tenant-backend/v1/admin/org-documents/`,
    {
      json: {
        filename: file.name,
        key: upload.key,
        mime_type: file.type,
        path: upload.path,
        size: file.size.toString(),
        url: "",
      },
      method: "POST",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to upload document!");
  }

  const { data } = await res.json();

  return data;
}
