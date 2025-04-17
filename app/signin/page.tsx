"use client";

// // import { useQuery } from "convex/react";
// // import { api } from "../../convex/_generated/api";

// // import Chat from "@/components/chat";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { useState, memo, useCallback } from "react";
// // import { BsPencilSquare } from "react-icons/bs";
// // import { RiSettings5Line } from "react-icons/ri";

// // // Left panel component (memoized to prevent unnecessary re-renders)
// // const ChatList = memo(
// //   ({ onSelectChat }: { onSelectChat: (id: number) => void }) => {
// //     const messages = Array.from({ length: 20 });

// //     return (
// //       <div className="h-screen px-4 overflow-scroll border-r">
// //         <div className="w-full h-12 flex justify-between items-center sticky top-0 z-10 bg-white">
// //           <p>Chat</p>
// //           <div className="flex gap-4">
// //             <button className="h-max">
// //               <BsPencilSquare size={18} />
// //             </button>
// //             <button className="h-max">
// //               <RiSettings5Line size={20} />
// //             </button>
// //           </div>
// //         </div>
// //         <input
// //           type="text"
// //           placeholder="Search"
// //           className="w-full h-7 rounded-md sticky top-12 z-10 mb-2 border placeholder:pl-2"
// //         />

// //         {messages.map((_, i) => (
// //           <button
// //             key={i}
// //             className="w-full flex items-center gap-3 p-2 hover:bg-slate-100 hover:rounded-md"
// //             onClick={() => onSelectChat(i + 1)}
// //           >
// //             <Avatar>
// //               <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
// //               <AvatarFallback>CN</AvatarFallback>
// //             </Avatar>
// //             <div className="flex flex-col items-start text-sm">
// //               <p className="font-semibold">Name {i + 1}</p>
// //               <p>Last message</p>
// //             </div>
// //             <p className="ml-auto self-start">10/2/2025</p>
// //           </button>
// //         ))}
// //       </div>
// //     );
// //   }
// // );

// // export default function Home() {
// //   const [chat_id, setChat_id] = useState<number>();

// //   // Memoize function to prevent unnecessary re-renders
// //   const handleSelectChat = useCallback((id: number) => {
// //     setChat_id(id);
// //   }, []);

// //   return (
// //     <div className="grid grid-cols-[minmax(250px,350px)_1fr]">
// //       <ChatList onSelectChat={handleSelectChat} />
// //       <Chat to={chat_id} />
// //     </div>
// //   );
// // }

// import { useAuthActions } from "@convex-dev/auth/react";

// export default function SignIn() {
//   const { signIn } = useAuthActions();
//   return (
//     <button onClick={() => void signIn("github")}>Sign in with GitHub</button>
//   );
// }
