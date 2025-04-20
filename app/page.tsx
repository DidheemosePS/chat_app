"use client";

import AnimatedRings from "@/components/animatedRings";
import Chat from "@/components/chat";
import ChatList from "@/components/chatList";
import SignIn from "@/components/signin";
import SignOut from "@/components/signout";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useState, useCallback } from "react";
import { IoIosChatbubbles } from "react-icons/io";
import { RiSettings5Line } from "react-icons/ri";

export default function Home() {
  const [conversation_id, setConversation_id] = useState<any>();

  // Memoize function to prevent unnecessary re-renders
  const handleSelectChat = useCallback((id: number) => {
    setConversation_id(id);
  }, []);

  return (
    <>
      <AuthLoading>
        <div className="flex items-center justify-center h-screen w-full">
          <AnimatedRings />
        </div>
      </AuthLoading>
      <div className="grid grid-cols-[60px_minmax(250px,350px)_1fr]">
        <div className="flex flex-col justify-between p-3 items-center bg-[#2c2c2c]">
          <button className="w-11 h-11 flex justify-center items-center mt-[1.5rem] rounded-md bg-[#3f3f3f]">
            <IoIosChatbubbles size={25} className="text-[#bfbfbf]" />
          </button>
          <button className="h-max mb-3">
            <RiSettings5Line size={25} className="text-[#bfbfbf]" />
          </button>
        </div>
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
        <Authenticated>
          <ChatList onSelectChat={handleSelectChat} />
          <Chat conversation_id={conversation_id} />
          <SignOut />
        </Authenticated>
      </div>
    </>
  );
}
