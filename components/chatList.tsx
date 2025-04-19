"use client";

import { BsPencilSquare } from "react-icons/bs";
import { RiSettings5Line } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { memo } from "react";

// Left panel component (memoized to prevent unnecessary re-renders)
const ChatList = memo(
  ({ onSelectChat }: { onSelectChat: (id: number) => void }) => {
    const messages = Array.from({ length: 20 });

    return (
      <div className="h-screen px-4 overflow-scroll border-r">
        <div className="w-full grid grid-cols-2 grid-rows-2 align-content-center gap-y-2 py-2 sticky top-0 z-10 bg-white">
          <p className="self-center">Chat</p>
          <div className="flex gap-4 justify-end items-center">
            <button className="h-max">
              <BsPencilSquare size={18} />
            </button>
            <button className="h-max">
              <RiSettings5Line size={20} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full h-7 rounded-md border placeholder:pl-2 col-span-2"
          />
        </div>

        {messages.map((_, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 p-2 hover:bg-slate-100 hover:rounded-md"
            onClick={() => onSelectChat(i + 1)}
          >
            <Avatar>
              <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-sm">
              <p className="font-semibold">Name {i + 1}</p>
              <p>Last message</p>
            </div>
            <p className="ml-auto self-start">10/2/2025</p>
          </button>
        ))}
      </div>
    );
  },
);

export default ChatList;
