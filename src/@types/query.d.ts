import "@tanstack/react-query";

type Key<T> = [T, ...(readonly unknown[])];

type MutationKey =
  | "createCustomer"
  | "deleteCustomer"
  | "updateCustomer"
  | "deleteDocument"
  | "uploadDocument"
  | "inviteOrganizationMember"
  | "removeOrganizationMember"
  | "createTask"
  | "deleteTask"
  | "updateTask";

type QueryKey =
  | "conversationSuggestion"
  | "customer"
  | "customerConversations"
  | "customers"
  | "customersInf"
  | "customersSearch"
  | "documents"
  | "me"
  | "organizationMembers"
  | "organization"
  | "profile"
  | "tasks"
  | "whatsappAvatars"
  | "whatsappContact"
  | "whatsappContacts"
  | "whatsappConversation"
  | "whatsappConversationInf"
  | "whatsappConversations"
  | "whatsappConversationsInf"
  | "whatsappFile"
  | "whatsappGroup"
  | "whatsappGroups"
  | "whatsappSearchConversations"
  | "chatbotConversations"
  | "messageRefinement"
  | "leadCompanies"
  | "leadEmployees"
  | "leadMetadata";

declare module "@tanstack/react-query" {
  interface Register {
    mutationKey: Key<MutationKey>;
    queryKey: Key<QueryKey>;
  }
}
