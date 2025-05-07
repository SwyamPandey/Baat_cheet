// ChatContainer.jsx
import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkelton from './skeltons/MessageSkeleton';
import { formatMessageTime } from '../lib/utils,js';
import { useAuthStore } from "../store/useAuthStore";
import { io } from 'socket.io-client';
import { useStatusStore } from '../store/useStatusStore';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    addMessage,
  } = useChatStore();  
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const socket = useRef();
  const { onlineUsers } = useStatusStore();

  useEffect(() => {
    if (!socket.current || !authUser?._id) return;

    // Add user to online list when component mounts
    socket.current.emit("add-user", authUser._id);
    console.log(socket.current)
    // Listen for status changes
    socket.current.on("user-status-changed", ({ userId, status, lastSeen }) => {
      console.log("Received user status change:", userId, status, lastSeen);
      if (status === "online") {
        useStatusStore.getState().setUserOnline(userId);
      } else {
        useStatusStore.getState().setUserOffline(userId, lastSeen);
      }
    });

    return () => {
      // Clean up listeners when component unmounts
      socket.current.off("user-status-changed");
    };
  }, []);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });

    // Add user to online users when component mounts
    if (authUser?._id) {
      socket.current.emit("add-user", authUser._id);
    }

    // Listen for incoming messages
    socket.current.on("msg-receive", (data) => {
      if (data.from === selectedUser._id) {
        addMessage({
          senderId: data.from,
          text: data.message.text,
          image: data.message.image,
          createdAt: new Date(),
        });
      }
    });

    // Clean up on unmount
    return () => {
      socket.current.off("msg-receive");
    };
  }, [authUser, selectedUser, addMessage]);

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessagesLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <MessageSkelton />
      <MessageInput socket={socket} />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <MessageInput socket={socket} />
    </div>
  );
};

export default ChatContainer;
