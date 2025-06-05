import { useAuthActions } from "@convex-dev/auth/react";

export default function SignIn() {
  const { signIn } = useAuthActions();
  return (
    <>
      <button onClick={() => void signIn("google")}>Sign in with Google</button>
      <button onClick={() => void signIn("github")}>Sign in with Github</button>
    </>
  );
}
