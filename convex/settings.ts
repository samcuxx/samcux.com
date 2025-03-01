import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Get a setting by key
 */
export const get = query({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("key"), args.key))
      .first();
    return setting ? setting.value : null;
  },
});

/**
 * Get all settings
 */
export const getAll = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").collect();
    return settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, any>
    );
  },
});

/**
 * Set a setting
 */
export const set = mutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    // Check if setting already exists
    const existingSetting = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("key"), args.key))
      .first();

    if (existingSetting) {
      // Update existing setting
      await ctx.db.patch(existingSetting._id, { value: args.value });
      return existingSetting._id;
    } else {
      // Create new setting
      const settingId = await ctx.db.insert("settings", {
        key: args.key,
        value: args.value,
      });
      return settingId;
    }
  },
});

/**
 * Delete a setting
 */
export const remove = mutation({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("key"), args.key))
      .first();

    if (setting) {
      await ctx.db.delete(setting._id);
      return setting._id;
    }

    return null;
  },
});
