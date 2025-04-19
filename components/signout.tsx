"use client";

import { useAuthActions } from "@convex-dev/auth/react";

export default function SignOut() {
  const { signOut } = useAuthActions();
  return <button onClick={() => void signOut()}>SignOut</button>;
}
