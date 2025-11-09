import apiClient from "./apiClient";

interface ChatRequest {
  message: string;
}

export const sendChatMessage = (data: ChatRequest) =>
  apiClient.post("/chat/chatUser", data);
