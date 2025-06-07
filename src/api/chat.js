import axios from "axios";

const chatApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Content-Type": "application/json",
  },
});

export const fetchUserRooms = (userId) => {
  return chatApi.get(`/api/chat/rooms/user/${userId}`);
};

export const fetchMessages = (roomId) => {
  return chatApi.get(`/api/chat/rooms/${roomId}`);
};

export const createChatRoom = (itemId, userId) => {
  return chatApi.post(`/api/chat/create-room`, { itemId, userId });
};

export const deleteChatRoom = (roomId) => {
  return chatApi.delete(`/api/chat/rooms/${roomId}`);
};
