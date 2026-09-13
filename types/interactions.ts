export type InteractionType = "review" | "comment" | "like" | "question";
export type InteractionStatus = "approved" | "pending" | "rejected";

export interface InteractionItem {
  id: number;
  type: InteractionType;
  productName: string;
  content: string;
  date: string;
  status: InteractionStatus;
  rating?: number;
}

export interface ProductQuestionReply {
  id: number;
  content: string;
  is_approved: number;
  is_admin_answer: boolean;
}

export interface ProductQuestionItem {
  id: number;
  productName: string;
  content: string;
  is_approved: number;
  replies?: ProductQuestionReply[];
}

export interface EditInteractionPayload {
  content: string;
  rating?: number;
}