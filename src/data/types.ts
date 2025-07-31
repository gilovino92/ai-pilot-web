import type { DateRange } from "react-day-picker";

import type { networks } from "./consts";
import type { WhatsAppConversationSearchResult } from "./types.whatsapp";

export type ApiResp<T> = {
  data: T;
  meta: {
    code: string;
    limit: number;
    message: string;
    page: number;
    page_size: number;
    total: number;
  };
};

export type Conversation = {
  id: string;
  latest_message?: ConversationMessage;
  type: ConversationType;
  unread_count: number;
};

export type ConversationMessage = (
  | {
      audio_message_info: MessageAudio;
      message_type: "audio";
    }
  | {
      conversation: string;
      message_type: "text";
    }
  | {
      document_message_info: MessageDocument;
      message_type: "document";
    }
  | {
      image_message_info: MessageImage;
      message_type: "image";
    }
  | {
      message_type: "video";
      video_message_info: MessageVideo;
    }
) &
  ConversationMessageBase;

export type ConversationMessageBase = {
  chat_id: string;
  id: string;
  is_edited?: boolean;
  message_context?: {
    replied_message_id?: string;
    replied_message_sender_id?: string;
  };
  sender_id: string;
  status: string;
  timestamp: number;
  translations: MessageTranslation[];
};

export type ConversationSearchResult = WhatsAppConversationSearchResult;

export type ConversationSummary = {
  conversation_id: string;
  created_at: number;
  summary: string;
  updated_at: number;
};

export type ConversationType =
  | "bot"
  | "broadcast"
  | "group"
  | "hidden"
  | "hosted"
  | "interop"
  | "legacy"
  | "messenger"
  | "newsletter"
  | "personal";

export type Customer = {
  address: string;
  company_name: string;
  email: string;
  id: number;
  industry: string;
  name: string;
  notes: string;
  num_employees: number;
  organization_id: number;
  phone_number: string;
  status: string;
  tax_code: string;
  website: string;
};

export type CustomerConversation = {
  conversation_id: string;
  id: number;
  network: Uppercase<Network>;
};

export type Document = {
  created_at: string;
  filename: string;
  id: number;
  key: string;
  mime_type: string;
  path: string;
  size: string;
  status?: "done" | "failed" | "in_progress";
  tenant_id: string;
  updated_at: string;
  url: string;
  user_id: string;
};

export type DocumentUpload = {
  key: string;
  path: string;
};

export type DocumentUrl = {
  key: string;
  url: string;
};

export type LeadCompany = {
  annual_revenue: number;
  city: string;
  company_number: string;
  country: string;
  country_code: number;
  current_technologies: string;
  description: string;
  estimated_num_employees: number;
  facebook_url: string;
  founded_year: number;
  id: string;
  industries: string;
  industry_keywords: string;
  keywords: string;
  linkedin_url: string;
  name: string;
  phone: string;
  postal_code: string;
  primary_domain: string;
  raw_address: string;
  region: number;
  region_code: number;
  request_timestamp: string;
  secondary_industries: string;
  short_description: string;
  state: string;
  street: string;
  twitter_url: string;
  vendor: string;
  website_url: string;
};

export type LeadEmployee = {
  address: string;
  business_id: number;
  campaign_id: number;
  captured_url: string;
  city: string;
  companies: LeadCompany[];
  company_phone_numbers: string;
  contact_id: number;
  country: string;
  created_at: string;
  created_by_id: number;
  created_by_source: string;
  current_company: string;
  current_company_id: number;
  current_role: string;
  description: string;
  email: string;
  employee_id: string;
  employee_number: number;
  external_id: string;
  first_name: string;
  hubspot_id: string;
  hubspot_object_id: string;
  is_crm_synced: boolean;
  last_name: string;
  lead_id: number;
  lead_status: string;
  lead_status_reason: string;
  linkedin_provider_id: string;
  linkedin_url: string;
  owner_id: number;
  personal_emails: string;
  phone_number: string;
  phone_numbers: string;
  private_flag: boolean;
  profile_pic: string;
  referrer: string;
  request_timestamp: string;
  salesforce_id: string;
  source: string;
  state: string;
  timezone: string;
  updated_at: string;
  work_emails: string;
  workspace_id: number;
  zipcode: string;
};

export type LeadFilters = {
  company?: string;
  company_size_max?: string;
  company_size_min?: string;
  countries?: string[];
  founded_year_max?: string;
  founded_year_min?: string;
  funding_date_range?: DateRange;
  funding_stages?: string[];
  industries?: string[];
  job_posting_date_range?: DateRange;
  job_postings?: string[];
  name?: string;
  retail_location_max?: string;
  retail_location_min?: string;
  revenue_max?: string;
  revenue_min?: string;
  technologies?: string[];
};

export type LeadMetadata = {
  countries: string[];
  industries: string[];
  technologies: string[];
};

export type Me = {
  company_profile: string;
  company_search_task_id?: string;
  company_website?: string;
  email: string;
  full_name: string;
  id: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified_company: boolean;
  is_verified_company_complete: boolean;
  is_whatapp_connected: boolean;
  phone: string;
  translation_language: string;
  whatsapp_connected_id?: string;
};

export type MessageAudio = {
  file_length: number;
  mime_type: string;
};

export type MessageDocument = {
  caption?: string;
  file_length: number;
  file_name: string;
  mime_type: string;
};

export type MessageImage = {
  caption?: string;
  file_length: number;
  height: number;
  mime_type: string;
  width: number;
};

export type MessageTranslation = {
  content: string;
  id: string;
  language: string;
};

export type MessageType =
  | "audio"
  | "document"
  | "image"
  | "sticker"
  | "text"
  | "video";

export type MessageVideo = {
  caption?: string;
  file_length: number;
  mime_type: string;
};

export type Network = (typeof networks)[number];

export type Organization = {
  domains: {
    name: string;
    verified: boolean;
  }[];
  id: string;
  name: string;
};

export type OrganizationMember = {
  email: string;
  email_verified: boolean;
  first_name: string;
  id: string;
  last_name: string;
  roles: string[];
  username: string;
};

export type Profile = {
  email: string;
  first_name: string;
  id: string;
  is_organization_admin: boolean;
  last_name: string;
  organization_id: string;
  phone_number: string;
};

export type Task = {
  conversation_id: string;
  created_at: number;
  customer_id: number;
  customer_name: string;
  description: string;
  due_date: number;
  id: string;
  is_ai_generated: boolean;
  status: "Completed" | "InProgress" | "New" | "Pending";
  updated_at: number;
  user_id: string;
};
