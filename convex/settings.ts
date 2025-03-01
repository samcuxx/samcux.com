import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Get all settings
 */
export const getAll = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").collect();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);
  },
});

/**
 * Get a single setting by key
 */
export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("key"), args.key))
      .first();
    return setting?.value;
  },
});

/**
 * Update a setting
 */
export const update = mutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("key"), args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
      return existing._id;
    }

    return await ctx.db.insert("settings", {
      key: args.key,
      value: args.value,
    });
  },
});

/**
 * Update multiple settings at once
 */
export const updateBatch = mutation({
  args: {
    settings: v.array(
      v.object({
        key: v.string(),
        value: v.any(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const setting of args.settings) {
      const existing = await ctx.db
        .query("settings")
        .filter((q) => q.eq(q.field("key"), setting.key))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, { value: setting.value });
        results.push(existing._id);
      } else {
        const id = await ctx.db.insert("settings", {
          key: setting.key,
          value: setting.value,
        });
        results.push(id);
      }
    }
    return results;
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
