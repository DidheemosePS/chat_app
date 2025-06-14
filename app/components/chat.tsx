"use client";

import { api } from "@/convex/_generated/api";
import { timeOnly } from "@/app/utils/timeFormat";
import { useMutation, useQuery } from "convex/react";
import { useRef, useState } from "react";
import { Delivered, Seen, Send } from "../assets/svgs/tick_svg";
import Plus from "@/app/assets/icons/plus.svg";
import Sent from "@/app/assets/icons/send.svg";
import Folder from "@/app/assets/icons/folder.svg";
import Photos from "@/app/assets/icons/photos.svg";
import Contacts from "@/app/assets/icons/contacts.svg";
import Poll from "@/app/assets/icons/poll.svg";
import Calendar from "@/app/assets/icons/calendar.svg";
import { Users } from "../utils/typeSafe";
import { Id } from "@/convex/_generated/dataModel";

export default function Chat({
  user_details,
}: {
  user_details: Omit<Users, "conversation_id"> & {
    conversation_id?: Id<"conversations">;
  };
}) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const messageBoxRef = useRef<HTMLInputElement>(null);
  const current_user = useQuery(api.myFunctions.currentUser);

  // Query the messages
  const messageList = useQuery(
    api.myFunctions.getMessages,
    user_details?.conversation_id && current_user?._id
      ? {
          conversation_id: user_details?.conversation_id,
          current_user: current_user?._id,
        }
      : "skip",
  );

  // const user_status = useQuery(
  //   api.myFunctions.getUserStatus,
  //   user_details?.user_id
  //     ? {
  //         user_id: user_details?.user_id,
  //       }
  //     : "skip",
  // );

  const sendMessage = useMutation(api.myFunctions.sendMessage);

  // function to send messages
  const handleMessage = async () => {
    const message = messageBoxRef.current?.value.trim();
    if (!message || !current_user?._id) return;
    await sendMessage({
      ...(user_details?.conversation_id && {
        conversation_id: user_details.conversation_id,
      }),
      sender_id: current_user._id,
      receiver_id: user_details?.user_id,
      content: message,
      content_type: "text",
      status: "send",
    });
    if (messageBoxRef.current) {
      messageBoxRef.current.value = "";
    }
  };

  // Function to handle chat options like files, photos & videos etc.
  const handleOptions = async () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  // Common styles repeating
  const optionsStyle: string =
    "flex gap-4 px-2 py-1.5 items-center rounded-sm hover:bg-[#545454] transition ease-in-out cursor-pointer";
  const iconStyle = "w-[23px] h-[23px]";
  const textStyle = "text-sm";
  const optionsButtons = [
    {
      icon: Folder,
      text: "File",
    },
    { icon: Photos, text: "Photos & Videos" },
    { icon: Contacts, text: "Contacts" },
    { icon: Poll, text: "Poll" },
    { icon: Calendar, text: "Calendar" },
  ];

  // Return message if there is no user details
  if (!user_details.user_id) {
    return (
      <p className="flex justify-center items-center px-4 text-sm">
        This is a real time chat application to beat whatsapp :)
      </p>
    );
  }

  return (
    <div className="grid grid-rows-[3rem_1fr_3rem] bg-[#1e1e1e]">
      <div className="flex items-center gap-3 px-4 border-b border-[#262a2d] bg-[#2c2c2c]">
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={
              user_details?.image_url ||
              "https://avatars.githubusercontent.com/u/124599?v=4"
            }
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-bold text-sm truncate pr-2">
            {user_details?.name}
          </p>
          <p className="text-[12px]">{user_details?.tag}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-4 overflow-y-auto h-[calc(100vh-6rem)] break-all relative">
        {Array.isArray(messageList?.messages) &&
          messageList?.messages.map((mes) => (
            <div
              key={mes?._id}
              className={`${mes?.sender_id === current_user?._id ? "self-end bg-green-900" : "self-start"} w-[80%] max-w-max h-max rounded-lg px-2 py-[.3rem] bg-[#2c2c2c] flex gap-3`}
            >
              <p className="text-[14.2px] leading-[1.3]">{mes?.content}</p>
              <div className="flex items-center self-end">
                <p className="w-8 text-[.70rem] break-keep text-[#a4a4a4]">
                  {timeOnly(mes?._creationTime)}
                </p>
                {mes?.sender_id == current_user?._id &&
                  (mes?.status === "send" ? (
                    <Send />
                  ) : mes?.status === "delivered" ? (
                    <Delivered />
                  ) : (
                    <Seen />
                  ))}
              </div>
            </div>
          ))}
        {isOptionsOpen ? (
          <div className="w-max h-max p-2 absolute bottom-0 left-2 z-10 bg-[#3f3f3f] rounded-md flex flex-col">
            {isOptionsOpen
              ? optionsButtons?.map((button, index) => (
                  <button className={optionsStyle} key={index}>
                    <button.icon className={iconStyle} />
                    <p className={textStyle}>{button.text}</p>
                  </button>
                ))
              : null}
          </div>
        ) : null}
      </div>
      <div className="flex gap-2 p-2 bg-[#2c2c2c]">
        <button
          className={`w-max h-max p-1 rounded-full hover:bg-[#3f3f3f] ${isOptionsOpen ? "rotate-45 transition ease-in-out" : "rotate-90 transition ease-in-out"}`}
          onClick={handleOptions}
        >
          <Plus />
        </button>
        <input
          type="text"
          className="w-full rounded-full px-3 field-sizing-content bg-[#3f3f3f] outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleMessage();
          }}
          ref={messageBoxRef}
        />
        <button
          className="w-max h-max p-[.31rem] rounded-full bg-green-700"
          onClick={handleMessage}
        >
          <Sent className="w-[19px] h-[19px]" />
        </button>
      </div>
    </div>
  );
}
