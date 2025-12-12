import apiClient from "./apiClient";
import { AxiosResponse } from "axios";

// Request interface
export interface ChatRequest {
  message: string;
}

// Response interface matching backend structure
export interface ChatResponse {
  message: string;
  from_knowledge_base: boolean;
  source: string | null;
}

// API service function with proper typing
export const sendChatMessage = (data: ChatRequest): Promise<AxiosResponse<ChatResponse>> =>
  apiClient.post("/chat/chatUser", data);
