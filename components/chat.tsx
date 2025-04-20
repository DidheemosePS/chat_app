"use client";

import { api } from "@/convex/_generated/api";
import { timeFormat } from "@/utils/timeFormat";
import { useMutation, useQuery } from "convex/react";
import React, { useRef } from "react";
import { IoMdSend } from "react-icons/io";

export default function Chat({ conversation_id }: { conversation_id: any }) {
  const messageBoxRef = useRef<HTMLInputElement>(null);
  const current_user = useQuery(api.myFunctions.currentUser);
  const messageList = useQuery(
    api.myFunctions.getMessages,
    conversation_id && current_user?._id
      ? { conversation_id: conversation_id, current_user: current_user?._id }
      : "skip",
  );

  const sendMessage = useMutation(api.myFunctions.sendMessage);

  if (!conversation_id) {
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
      conversation_id,
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
              messageList?.chat_user?.image ||
              "https://avatars.githubusercontent.com/u/124599?v=4"
            }
            className="w-full h-full object-cover"
          />
        </div>
        <p className="font-bold text-sm truncate pr-2">
          {messageList?.chat_user?.name}
        </p>
      </div>
      <div className="flex flex-col gap-1 p-4 overflow-y-auto h-[calc(100vh-6rem)] break-all">
        {messageList?.messages.map((mes) => (
          <div
            key={mes?._id}
            className={`${mes?.sender_id === current_user?._id ? "self-end" : "self-start"} w-2/4 max-w-max h-max rounded-lg text-[14.2px] leading-[1.3] px-3 py-[.3rem] bg-[#2c2c2c]`}
          >
            {mes?.content}
            {/* {timeFormat(mes?._creationTime)} */}
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-2 bg-[#2c2c2c]">
        <input
          type="text"
          className="w-full rounded-full px-3 field-sizing-content bg-[#3f3f3f] outline-none"
          ref={messageBoxRef}
        />
        <button
          className="w-10 h-9 rounded-full bg-green-800 relative"
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
