"use client";

import { BsPencilSquare } from "react-icons/bs";
import { memo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { timeFormat } from "@/utils/timeFormat";

// Left panel component (memoized to prevent unnecessary re-renders)
const ChatList = memo(
  ({ onSelectChat }: { onSelectChat: (id: any) => void }) => {
    const current_user = useQuery(api.myFunctions.currentUser);

    const chat_list = useQuery(
      api.myFunctions.getChatList,
      current_user ? { user_id: current_user?._id } : "skip",
    );

    return (
      <div className="h-screen px-4 overflow-scroll border-r border-[#262a2d]">
        <div className="w-full grid grid-cols-2 grid-rows-2 align-content-center gap-y-2 py-2 sticky top-0 z-10">
          <p className="self-center font-bold text-lg">Chats</p>
          <div className="flex gap-4 justify-end items-center">
            <button className="h-max">
              <BsPencilSquare size={17} className="text-[#bfbfbf]" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full h-7 rounded-md border border-[#262a2d] px-2 col-span-2 outline-none placeholder:text-sm"
          />
        </div>

        {chat_list?.map((chat, i) => (
          <button
            key={chat?._id}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition rounded-md"
            onClick={() => onSelectChat(chat?._id)}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={
                  chat?.other_user?.image ||
                  "https://avatars.githubusercontent.com/u/124599?v=4"
                }
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <div className="flex justify-between items-center w-full">
                <p className="font-bold text-sm truncate pr-2">
                  {chat?.other_user?.name}
                </p>
                <span className="text-xs text-[#676767] whitespace-nowrap flex-shrink-0">
                  {timeFormat(chat?.last_message_at)}
                </span>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-sm text-[#676767] truncate pr-2">
                  {chat?.last_message}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  },
);

export default ChatList;
