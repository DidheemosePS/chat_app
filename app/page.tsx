"use client";

import AnimatedRings from "@/app/assets/svgs/animatedRings";
import Chat from "@/app/components/chat";
import ChatList from "@/app/components/chatList";
import SideBar from "@/app/components/sideBar";
import SignIn from "@/app/components/signin";
import SignOut from "@/app/components/signout";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { useState, useCallback, useEffect } from "react";
import { generateUniqueTag } from "./utils/generateUniqueTag";
import { Users } from "./utils/typeSafe";

export default function Home() {
  const [user_details, setUser_details] = useState<Users>({
    user_id: "" as Id<"users">,
    name: "",
    image_url: "",
    tag: "",
  });

  // Memoize function to prevent unnecessary re-renders
  const handleSelectChat = useCallback(
    (
      user_details: Omit<Users, "conversation_id"> & {
        conversation_id?: Id<"conversations">;
      },
    ) => {
      setUser_details(user_details);
    },
    [],
  );

  // const { isAuthenticated } = useConvexAuth();
  // const currentUser = useQuery(api.myFunctions.currentUser);
  // const updateStatus = useMutation(api.myFunctions.update_user_status);

  // const [status, setStatus] = useState<"online" | "offline">("offline");

  // useEffect(() => {
  //   if (!isAuthenticated) return;

  //   const handleUserStatus = async () => {
  //     if (currentUser?._id && status !== "online") {
  //       await updateStatus({
  //         current_user_id: currentUser._id,
  //         status: "online",
  //       });
  //       setStatus("online");
  //     }
  //   };

  //   handleUserStatus();

  //   const handleOffline = async () => {
  //     if (currentUser?._id && status !== "offline") {
  //       await updateStatus({
  //         current_user_id: currentUser._id,
  //         status: "offline",
  //       });
  //       setStatus("offline");
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleOffline);
  //   window.addEventListener("unload", handleOffline);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleOffline);
  //     window.removeEventListener("unload", handleOffline);
  //   };
  // }, [isAuthenticated, currentUser, status, updateStatus]);

  return (
    <>
      <AuthLoading>
        <div className="flex items-center justify-center h-screen w-full">
          <AnimatedRings />
        </div>
      </AuthLoading>
      <div className="grid grid-cols-[60px_minmax(250px,350px)_1fr] fixed w-full h-screen">
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
        <Authenticated>
          <SideBar />
          <ChatList onSelectChat={handleSelectChat} />
          <Chat user_details={user_details} />
          <SignOut />
        </Authenticated>
      </div>
    </>
  );
}
