export type BaseEvent = {
  event: EventType;
};

export type ChatEvent =
  | MessageEndEvent
  | MessageEvent
  | NodeEvent
  | TTSMessageEvent
  | WorkflowEvent;

export type ChatStreamOptions = {
  onError?: (error: Error) => void;
  onMessageComplete?: (message: string) => void;
  onMessageStart?: () => void;
  onTTSAudio?: (audio: string) => void;
  onWorkflowEnd?: (workflow: WorkflowEvent) => void;
  onWorkflowStart?: (workflow: WorkflowEvent) => void;
};

export type EventType =
  | "message_end"
  | "message"
  | "node_finished"
  | "node_started"
  | "tts_message_end"
  | "tts_message"
  | "workflow_finished"
  | "workflow_started";

export type MessageEndEvent = {
  conversation_id: string;
  event: "message_end";
  id: string;
  metadata: {
    [key: string]: unknown;
    retriever_resources?: {
      [key: string]: unknown;
      content: string;
      dataset_id: string;
      dataset_name: string;
      document_id: string;
      document_name: string;
      position: number;
      score: number;
      segment_id: string;
    }[];
    usage: {
      [key: string]: unknown;
      completion_price: string;
      completion_tokens: number;
      currency: string;
      latency: number;
      prompt_price: string;
      prompt_tokens: number;
      total_price: string;
      total_tokens: number;
    };
  };
} & BaseEvent;

export type MessageEvent = {
  answer: string;
  conversation_id: string;
  created_at: number;
  event: "message";
  message_id: string;
} & BaseEvent;

export type NodeEvent = {
  data: {
    [key: string]: unknown;
    id: string;
    node_id: string;
    node_type: string;
    title: string;
  };
  event: "node_finished" | "node_started";
  task_id: string;
  workflow_run_id: string;
} & BaseEvent;

export type TTSMessageEvent = {
  audio: string;
  conversation_id: string;
  created_at: number;
  event: "tts_message_end" | "tts_message";
  message_id: string;
  task_id: string;
} & BaseEvent;

export type WorkflowEvent = {
  data: {
    [key: string]: unknown;
    id: string;
    workflow_id: string;
  };
  event: "workflow_finished" | "workflow_started";
  task_id: string;
  workflow_run_id: string;
} & BaseEvent;
