"use client";

import AnimatedRings from "@/components/animatedRings";
import Chat from "@/components/chat";
import ChatList from "@/components/chatList";
import SideBar from "@/components/sideBar";
import SignIn from "@/components/signin";
import SignOut from "@/components/signout";
import { api } from "@/convex/_generated/api";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { useState, useCallback, useEffect } from "react";

export default function Home() {
  const [conversation_id, setConversation_id] = useState<any>();

  // Memoize function to prevent unnecessary re-renders
  const handleSelectChat = useCallback((id: number) => {
    setConversation_id(id);
  }, []);

  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(api.myFunctions.currentUser);
  const updateStatus = useMutation(api.myFunctions.update_user_status);

  const [status, setStatus] = useState<"online" | "offline">("offline");

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleUserStatus = async () => {
      if (currentUser?._id && status !== "online") {
        await updateStatus({
          current_user_id: currentUser._id,
          status: "online",
        });
        setStatus("online");
      }
    };

    handleUserStatus();

    const handleOffline = async () => {
      if (currentUser?._id && status !== "offline") {
        await updateStatus({
          current_user_id: currentUser._id,
          status: "offline",
        });
        setStatus("offline");
      }
    };

    window.addEventListener("beforeunload", handleOffline);
    window.addEventListener("unload", handleOffline);

    return () => {
      window.removeEventListener("beforeunload", handleOffline);
      window.removeEventListener("unload", handleOffline);
    };
  }, [isAuthenticated, currentUser, status, updateStatus]);

  return (
    <>
      <AuthLoading>
        <div className="flex items-center justify-center h-screen w-full">
          <AnimatedRings />
        </div>
      </AuthLoading>
      <div className="grid grid-cols-[60px_minmax(250px,350px)_1fr]">
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
        <Authenticated>
          <SideBar />
          <ChatList onSelectChat={handleSelectChat} />
          <Chat conversation_id={conversation_id} />
          <SignOut />
        </Authenticated>
      </div>
    </>
  );
}
