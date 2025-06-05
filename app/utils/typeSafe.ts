import { Id } from "@/convex/_generated/dataModel";

export interface users {
  user_id: Id<"users">;
  conversation_id: Id<"conversations">;
  name: string;
  image_url: string;
}
