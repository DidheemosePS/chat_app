"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import React, { useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";

export default function Chat({ to }: { to: number | undefined }) {
  const messageBoxRef = useRef<HTMLInputElement>(null);
  const messageList = useQuery(api.chat.getMessages);
  const sendMessage = useMutation(api.chat.sendMessage);

  if (!to) {
    return (
      <p className="flex justify-center items-center px-4">
        This is a real time chat application to beat whatsapp :)
      </p>
    );
  }

  const handleMessage = async () => {
    const message = messageBoxRef.current?.value.trim();
    if (!message) return;
    await sendMessage({ from: "Didhee", to, message });
    if (messageBoxRef.current) {
      messageBoxRef.current.value = "";
    }
  };

  return (
    <div className="grid grid-rows-[3rem_1fr_3rem]">
      <div className="flex items-center gap-3 p-5 border-b">
        <Avatar className="w-9 h-9">
          <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p>Name {to}</p>
      </div>
      <div className="flex flex-col gap-2 p-4 overflow-y-auto h-[calc(100vh-6rem)] break-all">
        {messageList?.map((mes, id) => (
          <div
            key={id}
            className={`${mes?.from === "Didhee" ? "self-end" : "self-start"} w-2/4 max-w-max h-max rounded-lg px-2 py-[1.5px] bg-gray-400`}
          >
            {mes?.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-2">
        <input
          type="text"
          className="w-full rounded-full border px-3 field-sizing-content"
          ref={messageBoxRef}
        />
        <button
          className="w-10 h-9 rounded-full bg-yellow-400 relative"
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
