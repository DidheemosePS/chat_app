import { memo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { timeFormat } from "@/app/utils/timeFormat";
import { Delivered, Seen, Send } from "../assets/svgs/tick_svg";
import Edit from "@/app/assets/icons/edit.svg";
import NewChatSearch from "./newChatSearch";
import { Users } from "../utils/typeSafe";
import { ReUseableButtons } from "./reUseableButtons";

// Left panel component (memoized to prevent unnecessary re-renders)
const ChatList = memo(
  ({ onSelectChat }: { onSelectChat: (params: Users) => void }) => {
    const current_user = useQuery(api.myFunctions.currentUser);

    // Query to get the chat history
    const chat_list = useQuery(
      api.myFunctions.getChatList,
      current_user ? { user_id: current_user?._id } : "skip",
    );

    // Function to handle search box like open close
    const [openSearch, setOpenSearch] = useState(false);
    function newChatButton() {
      setOpenSearch((prev) => !prev);
    }
    return (
      <div className="h-screen border-r border-[#262a2d] relative flex flex-col">
        <div className="w-full grid grid-cols-2 grid-rows-2 align-content-center gap-y-2 px-4 py-2 sticky top-0 z-10">
          <p className="self-center font-bold text-lg">Chats</p>
          <ReUseableButtons
            Icon={Edit}
            style="w-max -h-max flex gap-4 justify-end items-center px-1 rounded hover:bg-[#3f3f3f] justify-self-end"
            iconStyle="w-[20px] h-[20px]"
            functionCall={newChatButton}
          />
          <input
            type="text"
            placeholder="Search name or tag"
            className="w-full h-7 rounded-md border border-[#262a2d] px-2 col-span-2 outline-none text-[14.2px] placeholder:text-[13px]"
          />
          {openSearch ? <NewChatSearch onSelectChat={onSelectChat} /> : null}
        </div>
        <div className="flex-1 overflow-y-scroll px-4">
          {chat_list?.map((chat, i) => (
            <button
              key={chat?._id}
              className="w-full flex items-center gap-3 p-2 hover:bg-[#2c2c2c] transition rounded-md"
              onClick={() =>
                onSelectChat({
                  user_id: chat?.other_user?._id,
                  conversation_id: chat?._id,
                  name: chat?.other_user?.name!,
                  image_url: chat?.other_user?.image!,
                  tag: chat?.other_user?.tag!,
                })
              }
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
                <div className="flex items-center w-full">
                  {chat?.other_user?._id !== current_user?._id &&
                    (chat?.last_message_status === "send" ? (
                      <Send />
                    ) : chat?.last_message_status === "delivered" ? (
                      <Delivered />
                    ) : (
                      <Seen />
                    ))}
                  <p className="text-[14.2px] text-[#676767] truncate pr-2">
                    {chat?.last_message}
                  </p>
                  <div className="w-4 h-4 text-xs rounded-full text-[#202020] ml-auto bg-green-600 flex justify-center items-center">
                    {chat?.unreadCounts}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  },
);

export default ChatList;
