"use client";

import Call from "@/app/assets/icons/call.svg";
import Chat from "@/app/assets/icons/chat.svg";
import Settings from "@/app/assets/icons/settings.svg";

export default function SideBar() {
  return (
    <div className="flex flex-col justify-between items-center h-screen p-3 bg-[#2c2c2c]">
      <div className="flex flex-col items-center gap-1">
        <button className="w-11 h-11 flex justify-center items-center mt-[1.5rem] rounded-md bg-[#3f3f3f]">
          <Chat />
        </button>
        <button className="w-11 h-11 flex justify-center items-center rounded-md hover:bg-[#3f3f3f]">
          <Call />
        </button>
      </div>
      <button className="w-11 h-11 flex justify-center items-center mb-3 rounded-md hover:bg-[#3f3f3f]">
        <Settings />
      </button>
    </div>
  );
}
