"use client";

import { api } from "@/convex/_generated/api";
import React, { useRef, useState } from "react";
import { Users } from "../utils/typeSafe";
import { useConvex } from "convex/react";
import Close from "@/app/assets/icons/close.svg";

export default function NewChatSearch({
  onSelectChat,
}: {
  onSelectChat: (params: Users) => void;
}) {
  const convex = useConvex();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<Users>();
  const [searchInputActive, setSearchInputActive] = useState(false);

  // Function to keep a eye on search input field
  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length === 0) {
      setSearchInputActive(false);
      return;
    }
    setSearchInputActive(true);
    if (e.target.value.length === 6) {
      const newChatUser = await convex.query(api.myFunctions.getUserTag, {
        tag: e.target.value,
      });

      if (newChatUser)
        setSearchResults({
          user_id: newChatUser.user_id!,
          name: newChatUser.name!,
          image_url: newChatUser.image_url!,
          tag: newChatUser.tag!,
        });
    }
  }

  // Function to restrict to entering any others alphanumeric values
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const key = e.key;
    const navKeys = ["@", "Backspace", "Tab", "ArrowLeft", "ArrowRight"];
    if (!/^[a-zA-Z0-9]$/.test(key) && !navKeys.includes(key))
      e.preventDefault();
  }

  return (
    <div className="w-72 min-h-80 absolute flex flex-col items-center gap-3 -right-28 top-11 z-20 border rounded-lg border-[#31363a] bg-[#202020] p-3">
      <p className="font-bold text-sm">New Chat</p>
      <div className="w-full relative">
        <input
          type="text"
          placeholder="Search by tag @f312s"
          maxLength={6}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => handleInputChange(e)}
          ref={searchInputRef}
          className="w-full h-7 rounded-md border border-[#262a2d] px-2 col-span-2 outline-none text-[12px] placeholder:text-[12px]"
        />
        {searchInputActive ? (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => {
              searchInputRef.current
                ? (searchInputRef.current.value = "")
                : null;
              setSearchInputActive(false);
            }}
          >
            <Close className="w-[.85rem] h-[.85rem]" />
          </button>
        ) : null}
      </div>
      {searchResults ? (
        <button
          className="w-full flex items-center justify-start gap-3 px-2 py-1.5 bg-[#3f3f3f] transition rounded-md"
          onClick={() =>
            onSelectChat({
              user_id: searchResults?.user_id,
              name: searchResults?.name!,
              image_url: searchResults?.image_url!,
              tag: searchResults?.tag!,
            })
          }
        >
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={
                searchResults?.image_url ||
                (searchResults &&
                  "https://avatars.githubusercontent.com/u/124599?v=4")
              }
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-1 items-start">
            <p className="text-sm font-bold truncate pr-2">
              {searchResults?.name}
            </p>
            <p className="text-[12px]">{searchResults?.tag}</p>
          </div>
        </button>
      ) : (
        <p className="text-xs">No results</p>
      )}
    </div>
  );
}
