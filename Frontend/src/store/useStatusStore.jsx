// src/store/useStatusStore.js
import { create } from 'zustand';

export const useStatusStore = create((set) => ({
  onlineUsers: new Map(), // userId -> { status, lastSeen }
  
  setUserOnline: (userId) => set((state) => {
    const onlineUsers = new Map(state.onlineUsers);
    onlineUsers.set(userId, { status: 'online', lastSeen: null });
    return { onlineUsers };
  }),
  
  setUserOffline: (userId, lastSeen) => set((state) => {
    const onlineUsers = new Map(state.onlineUsers);
    onlineUsers.set(userId, { status: 'offline', lastSeen });
    return { onlineUsers };
  }),
  
  updateUserStatus: (userId, status) => set((state) => {
    const onlineUsers = new Map(state.onlineUsers);
    const userData = onlineUsers.get(userId) || {};
    onlineUsers.set(userId, { ...userData, status });
    return { onlineUsers };
  }),
}));