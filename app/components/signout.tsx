"use client";

import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";

// Signout component and functions
export default function SignOut() {
  const current_user = useQuery(api.myFunctions.currentUser);
  const { signOut } = useAuthActions();
  // const update_status = useMutation(api.myFunctions.update_user_status);
  // const signOut_changeStatus = async () => {
  //   if (current_user?._id) {
  //     await update_status({
  //       current_user_id: current_user?._id,
  //       status: "offline",
  //     });
  //     signOut();
  //   }
  // };
  return <button onClick={() => void signOut()}>SignOut</button>;
}
