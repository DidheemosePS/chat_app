import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

// // Write your Convex functions in any file inside this directory (`convex`).
// // See https://docs.convex.dev/functions for more.

// // You can read data from the database via a query:
// export const listNumbers = query({
//   // Validators for arguments.
//   args: {
//     count: v.number(),
//   },

//   // Query implementation.
//   handler: async (ctx, args) => {
//     //// Read the database as many times as you need here.
//     //// See https://docs.convex.dev/database/reading-data.
//     const numbers = await ctx.db
//       .query("numbers")
//       // Ordered by _creationTime, return most recent
//       .order("desc")
//       .take(args.count);
//     const userId = await getAuthUserId(ctx);
//     const user = userId === null ? null : await ctx.db.get(userId);
//     return {
//       viewer: user?.email ?? null,
//       numbers: numbers.reverse().map((number) => number.value),
//     };
//   },
// });

// // You can write data to the database via a mutation:
// export const addNumber = mutation({
//   // Validators for arguments.
//   args: {
//     value: v.number(),
//   },

//   // Mutation implementation.
//   handler: async (ctx, args) => {
//     //// Insert or modify documents in the database here.
//     //// Mutations can also read from the database like queries.
//     //// See https://docs.convex.dev/database/writing-data.

//     const id = await ctx.db.insert("numbers", { value: args.value });

//     console.log("Added new document with id:", id);
//     // Optionally, return a value from your mutation.
//     // return id;
//   },
// });

// // You can fetch data from and send data to third-party APIs via an action:
// export const myAction = action({
//   // Validators for arguments.
//   args: {
//     first: v.number(),
//     second: v.string(),
//   },

//   // Action implementation.
//   handler: async (ctx, args) => {
//     //// Use the browser-like `fetch` API to send HTTP requests.
//     //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
//     // const response = await ctx.fetch("https://api.thirdpartyservice.com");
//     // const data = await response.json();

//     //// Query data by running Convex queries.
//     const data = await ctx.runQuery(api.myFunctions.listNumbers, {
//       count: 10,
//     });
//     console.log(data);

//     //// Write data by running Convex mutations.
//     await ctx.runMutation(api.myFunctions.addNumber, {
//       value: args.first,
//     });
//   },
// });

export const sendMessage = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
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

    const chat_user = await ctx.db
      .get(args.conversation_id)
      .then((conversation) => {
        if (!conversation) return null;
        const otherUserId =
          conversation.user1_id === args.current_user
            ? conversation.user2_id
            : conversation.user1_id;
        return ctx.db.get(otherUserId);
      });

    return {
      messages,
      chat_user,
    };
  },
});

export const getChatList = query({
  args: {
    user_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const chatList = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1_id"), args.user_id),
          q.eq(q.field("user2_id"), args.user_id),
        ),
      )
      .order("desc")
      .collect();

    const otherUserIds = chatList.map((chat) =>
      chat.user1_id === args.user_id ? chat.user2_id : chat.user1_id,
    );

    const uniqueUserIds = Array.from(new Set(otherUserIds));

    const users = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(...uniqueUserIds.map((id) => q.eq(q.field("_id"), id))),
      )
      .collect();

    const userMap = Object.fromEntries(users.map((u) => [u._id, u]));

    const enrichedChatList = chatList.map((chat) => {
      const otherUserId =
        chat.user1_id === args.user_id ? chat.user2_id : chat.user1_id;
      return {
        ...chat,
        other_user: userMap[otherUserId] ?? null,
      };
    });
    return enrichedChatList;
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
