"use client";
import { IoCallOutline, IoChatbubblesOutline } from "react-icons/io5";
import { RiSettings5Line } from "react-icons/ri";

export default function SideBar() {
  return (
    <div className="flex flex-col justify-between items-center h-screen p-3 bg-[#2c2c2c]">
      <div className="flex flex-col items-center gap-1">
        <button className="w-11 h-11 flex justify-center items-center mt-[1.5rem] rounded-md bg-[#3f3f3f]">
          <IoChatbubblesOutline size={24} className="text-[#bfbfbf]" />
        </button>
        <button className="w-11 h-11 flex justify-center items-center rounded-md hover:bg-[#3f3f3f]">
          <IoCallOutline size={22} className="text-[#bfbfbf]" />
        </button>
      </div>
      <button className="w-11 h-11 flex justify-center items-center mb-3 rounded-md hover:bg-[#3f3f3f]">
        <RiSettings5Line size={25} className="text-[#bfbfbf]" />
      </button>
    </div>
  );
}
