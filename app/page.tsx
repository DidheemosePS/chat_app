"use client";

import AnimatedRings from "@/components/animatedRings";
import Chat from "@/components/chat";
import ChatList from "@/components/chatList";
import SignIn from "@/components/signin";
import SignOut from "@/components/signout";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useState, useCallback } from "react";

export default function Home() {
  const [chat_id, setChat_id] = useState<number>();

  // Memoize function to prevent unnecessary re-renders
  const handleSelectChat = useCallback((id: number) => {
    setChat_id(id);
  }, []);

  return (
    <>
      <AuthLoading>
        <div className="flex items-center justify-center h-screen w-full">
          <AnimatedRings />
        </div>
      </AuthLoading>
      <div className="grid grid-cols-[minmax(250px,350px)_1fr]">
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
        <Authenticated>
          <ChatList onSelectChat={handleSelectChat} />
          <Chat to={chat_id} />
          <SignOut />
        </Authenticated>
      </div>
    </>
  );
}
