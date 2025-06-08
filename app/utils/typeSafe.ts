import { Id } from "@/convex/_generated/dataModel";

// Typescript types are defined here
export type Users = {
  user_id: Id<"users">;
  conversation_id?: Id<"conversations">;
  name: string;
  image_url: string;
  tag: string;
};
