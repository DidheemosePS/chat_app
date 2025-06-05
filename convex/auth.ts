import { MutationCtx } from './_generated/server';
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import { generateUniqueTag } from "../app/utils/generateUniqueTag";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub, Google],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx: MutationCtx, {userId}) {
      const existingUser = await ctx.db.get(userId);
      if (existingUser?.tag) return; // Skip if the tag already exists in the table
      await ctx.db.patch(userId, {tag: generateUniqueTag()});
    },
  },
});
