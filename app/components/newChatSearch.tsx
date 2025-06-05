"use client";

import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import React from "react";

export default function NewChatSearch() {
  const getUserTagAction = useAction(api.myFunctions.getUserTagAction);
  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length === 6) {
      const newChatUser = await getUserTagAction({ tag: e.target.value });
      console.log(newChatUser);
    }
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const key = e.key;
    const navKeys = ["@", "Backspace", "Tab", "ArrowLeft", "ArrowRight"];
    if (!/^[a-zA-Z0-9]$/.test(key) && !navKeys.includes(key))
      e.preventDefault();
  }

  return (
    <input
      type="text"
      placeholder="Search by tag @f312s"
      maxLength={6}
      onKeyDown={(e) => handleKeyDown(e)}
      onChange={(e) => handleInputChange(e)}
      className="w-full h-7 rounded-md border border-[#262a2d] px-2 col-span-2 outline-none text-[14.2px] placeholder:text-[14.2px]"
    />
  );
}
