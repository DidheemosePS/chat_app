import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const sendMessage = mutation({
  args: {
    conversation_id: v.optional(v.id("conversations")),
    sender_id: v.id("users"),
    receiver_id: v.id("users"),
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
  },
  handler: async (ctx, args) => {
    if (args.conversation_id) {
      const message_id = await ctx.db.insert("messages", {
        conversation_id: args.conversation_id,
        sender_id: args.sender_id,
        content: args.content,
        content_type: args.content_type,
        status: "send",
      });

      // Update conversation last message time
      await ctx.db.patch(args.conversation_id, {
        last_message_at: Date.now(),
        last_message: args.content,
      });

      return message_id;
    }
    // Create new conversation
    const conversation_id = await ctx.db.insert("conversations", {
      user1_id: args.sender_id,
      user2_id: args.receiver_id,
      last_message_at: Date.now(),
      last_message: args.content,
    });

    const message_id = await ctx.db.insert("messages", {
      conversation_id: conversation_id,
      sender_id: args.sender_id,
      content: args.content,
      content_type: args.content_type,
      status: "send",
    });

    return message_id;
  },
});

export const getMessages = query({
  args: {
    conversation_id: v.id("conversations"),
    current_user: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversations", (q) =>
        q.eq("conversation_id", args.conversation_id),
      )
      .order("asc")
      .take(100);

    return {
      messages,
    };
  },
});

export const getChatList = query({
  args: {
    user_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    // 1. Get all conversations with built-in last_message
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1_id"), args.user_id),
          q.eq(q.field("user2_id"), args.user_id),
        ),
      )
      .order("desc")
      .collect();

    if (conversations.length === 0) return [];

    // 2. Get only the status of last messages (optimized query)
    const lastMessageStatuses = await Promise.all(
      conversations.map((conv) =>
        ctx.db
          .query("messages")
          .withIndex("by_conversations", (q) =>
            q.eq("conversation_id", conv._id),
          )
          .order("desc")
          .first()
          .then((msg) => msg?.status || null),
      ),
    );

    const unreadCounts = await Promise.all(
      conversations.map(async (conv) => {
        const deliveredCount = await ctx.db
          .query("messages")
          .withIndex("by_conversation_status", (q) =>
            q.eq("conversation_id", conv._id).eq("status", "delivered"),
          )
          .filter((q) => q.neq("sender_id", args.user_id as any))
          .collect()
          .then((msgs) => msgs.length);

        const sentCount = await ctx.db
          .query("messages")
          .withIndex("by_conversation_status", (q) =>
            q.eq("conversation_id", conv._id).eq("status", "send"),
          )
          .filter((q) => q.neq("sender_id", args.user_id as any))
          .collect()
          .then((msgs) => msgs.length);

        return deliveredCount + sentCount;
      }),
    );

    // 3. Get other users' data
    const otherUserIds = conversations.map((conv) =>
      conv.user1_id === args.user_id ? conv.user2_id : conv.user1_id,
    );
    const uniqueUserIds = [...new Set(otherUserIds)];

    const users = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(...uniqueUserIds.map((id) => q.eq(q.field("_id"), id))),
      )
      .collect();

    const userMap = Object.fromEntries(users.map((u) => [u._id, u]));

    // 4. Compose final result
    return conversations.map((conv, index) => ({
      ...conv,
      other_user:
        userMap[
          conv.user1_id === args.user_id ? conv.user2_id : conv.user1_id
        ] || null,
      last_message_status: lastMessageStatuses[index],
      unreadCounts: unreadCounts[index],
    }));
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const update_user_status = mutation({
  args: {
    current_user_id: v.id("users"),
    status: v.optional(v.union(v.literal("online"), v.literal("offline"))),
  },
  handler: async (ctx, args) => {
    const updateData: Record<string, any> = {
      status: args.status,
    };

    if (args.status === "offline") {
      updateData.last_seen = Date.now();
    }

    await ctx.db.patch(args.current_user_id, updateData);
  },
});

export const getUserStatus = query({
  args: {
    user_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    return { user_status: user?.status, last_seen: user?.last_seen };
  },
});

export const getUserTag = query({
  args: {
    tag: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tag", (q) => q.eq("tag", args.tag))
      .first();
    if (!user) return null;
    return {
      user_id: user._id,
      name: user.name,
      image_url: user.image,
      tag: user.tag,
    };
  },
});
