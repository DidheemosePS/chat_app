import Call from "@/app/assets/icons/call.svg";
import Chat from "@/app/assets/icons/chat.svg";
import Settings from "@/app/assets/icons/settings.svg";
import { ReUseableButtons } from "./reUseableButtons";
import SignOut from "./signout";
import { useAuthActions } from "@convex-dev/auth/react";

// Slidebar or navigation component
export default function SideBar() {
  const { signOut } = useAuthActions();
  return (
    <div className="flex flex-col justify-between items-center h-screen p-3 bg-[#2c2c2c]">
      <div className="flex flex-col items-center gap-1">
        <ReUseableButtons
          Icon={Chat}
          style="w-11 h-11 flex justify-center items-center mt-[1.5rem] rounded-md bg-[#3f3f3f]"
        />
        <ReUseableButtons
          Icon={Call}
          style="w-11 h-11 flex justify-center items-center rounded-md hover:bg-[#3f3f3f]"
        />
      </div>
      <ReUseableButtons
        Icon={Settings}
        style="w-11 h-11 flex justify-center items-center mb-3 rounded-md hover:bg-[#3f3f3f]"
        functionCall={() => signOut()}
      />
    </div>
  );
}
