import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("online"), v.literal("offline"))),
    last_seen: v.optional(v.number()),
  }),

  conversations: defineTable({
    user1_id: v.id("users"),
    user2_id: v.id("users"),
    last_message_at: v.number(),
    last_message: v.string(),
  })
    .index("by_users", ["user1_id", "user2_id"])
    .index("by_user1", ["user1_id"])
    .index("by_user2", ["user2_id"]),

  participants: defineTable({
    conversation_id: v.id("conversations"),
    user_id: v.id("users"),
    joined_at: v.number(),
    role: v.union(v.literal("admin"), v.literal("member")),
    muted_until: v.string(),
  }),

  messages: defineTable({
    conversation_id: v.id("conversations"),
    sender_id: v.id("users"),
    content: v.string(),
    content_type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("video"),
      v.literal("file"),
    ),
    status: v.union(
      v.literal("send"),
      v.literal("delivered"),
      v.literal("read"),
    ),
  })
    .index("by_conversations", ["conversation_id"])
    .index("by_conversation_status", ["conversation_id", "status"]),

  attachments: defineTable({
    message_id: v.id("messages"),
    file_url: v.string(),
    file: v.string(),
    file_type: v.string(),
    file_size: v.string(),
    uploaded_at: v.string(),
  }),
  read_receipts: defineTable({
    receipt_id: v.id("users"),
    message_id: v.id("messages"),
    user_id: v.id("users"),
    read_at: v.string(),
  }),
});
