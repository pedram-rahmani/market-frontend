export interface ChatUser {
  id: number;
  name: string;
  username?: string;
  role?: string;
}

export interface ChatMessageItem {
  id: number;
  conversation_id: number;
  user_id: number;
  message: string;
  created_at: string;
  user?: ChatUser;
}

export interface LastMessage {
  id: number;
  message: string;
  user_id: number;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: number;
  status: "open" | "closed";
  last_message_at: string | null;
  user?: ChatUser;
  messages?: ChatMessageItem[];
  unread_count?: number;
}