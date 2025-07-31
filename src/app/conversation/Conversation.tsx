import { Link } from "@tanstack/react-router";

import type {
  Conversation,
  ConversationSearchResult,
  Network,
} from "@/data/types";

import ConversationWhatsApp from "./ConversationWhatsApp";

type ConversationProps = {
  contact?: ConversationSearchResult["contact"];
  data: Conversation;
  group?: ConversationSearchResult["group"];
  network: Network;
};

export default function Conversation({
  data,
  from,
  network,
  ...rest
}: {
  from: "/companies/$companyId/conversations" | "/conversations";
} & ConversationProps) {
  return (
    <Link
      className="group"
      from={from}
      params={{ conversationId: data.id, network }}
      to="./$network/$conversationId"
    >
      <ConversationSwitch data={data} network={network} {...rest} />
    </Link>
  );
}

function ConversationSwitch({ network, ...rest }: ConversationProps) {
  switch (network) {
    case "whatsapp":
      return <ConversationWhatsApp {...rest} />;
    default:
      return null;
  }
}
