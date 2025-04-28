"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { timeFormat, timeOnly } from "@/utils/timeFormat";
import { useMutation, useQuery } from "convex/react";
import React, { useRef } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { IoMdSend } from "react-icons/io";
import { Seen } from "./tick_svg";

interface UserDetails {
  user_id: Id<"users">;
  conversation_id: Id<"conversations">;
  name: string;
  image_url: string;
}

export default function Chat({ user_details }: { user_details: UserDetails }) {
  const messageBoxRef = useRef<HTMLInputElement>(null);
  const current_user = useQuery(api.myFunctions.currentUser);
  const messageList = useQuery(
    api.myFunctions.getMessages,
    user_details?.conversation_id && current_user?._id
      ? {
          conversation_id: user_details?.conversation_id,
          current_user: current_user?._id,
        }
      : "skip",
  );

  const user_status = useQuery(
    api.myFunctions.getUserStatus,
    user_details?.user_id
      ? {
          user_id: user_details?.user_id,
        }
      : "skip",
  );

  const sendMessage = useMutation(api.myFunctions.sendMessage);

  if (!user_details?.conversation_id) {
    return (
      <p className="flex justify-center items-center px-4 text-sm">
        This is a real time chat application to beat whatsapp :)
      </p>
    );
  }

  const handleMessage = async () => {
    const message = messageBoxRef.current?.value.trim();
    if (!message || !current_user?._id) return;
    await sendMessage({
      conversation_id: user_details?.conversation_id,
      sender_id: current_user._id,
      content: message,
      content_type: "text",
      status: "send",
    });
    if (messageBoxRef.current) {
      messageBoxRef.current.value = "";
    }
  };

  return (
    <div className="grid grid-rows-[3rem_1fr_3rem] bg-[#1e1e1e]">
      <div className="flex items-center gap-3 p-5 border-b border-[#262a2d] bg-[#2c2c2c]">
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={
              user_details?.image_url ||
              "https://avatars.githubusercontent.com/u/124599?v=4"
            }
            className="w-full h-full object-cover"
          />
        </div>
        <div className="font-bold text-sm truncate pr-2">
          {user_details?.name}
          <p className="text-[.70rem] font-normal text-[#a4a4a4]">
            {user_status?.user_status === "online"
              ? "Online"
              : user_status?.last_seen
                ? `Last seen at ${timeFormat(user_status.last_seen)}`
                : null}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-4 overflow-y-auto h-[calc(100vh-6rem)] break-all">
        {messageList?.messages.map((mes) => (
          <div
            key={mes?._id}
            className={`${mes?.sender_id === current_user?._id ? "self-end bg-green-900" : "self-start"} w-[80%] max-w-max h-max rounded-lg px-2 py-[.3rem] bg-[#2c2c2c] flex gap-3`}
          >
            <p className="text-[14.2px] leading-[1.3]">{mes?.content}</p>
            <div className="flex items-center self-end">
              <p className="w-8 text-[.70rem] break-keep text-[#a4a4a4]">
                {timeOnly(mes?._creationTime)}
              </p>
              {mes?.sender_id === current_user?._id ? <Seen /> : null}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-2 bg-[#2c2c2c]">
        <button
          className="p-4 rounded-full relative hover:bg-[#3f3f3f]"
          onClick={handleMessage}
        >
          <HiOutlinePlus
            size={20}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </button>
        <input
          type="text"
          className="w-full rounded-full px-3 field-sizing-content bg-[#3f3f3f] outline-none"
          ref={messageBoxRef}
        />
        <button
          className="p-4 rounded-full bg-green-700 relative"
          onClick={handleMessage}
        >
          <IoMdSend
            size={20}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </button>
      </div>
    </div>
  );
}
