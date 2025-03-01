import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Get the profile information
 */
export const get = query({
  handler: async (ctx) => {
    const profiles = await ctx.db
      .query("profile")
      .withIndex("by_singleton")
      .collect();

    return profiles.length > 0 ? profiles[0] : null;
  },
});

/**
 * Create or update the profile
 */
export const upsert = mutation({
  args: {
    name: v.string(),
    title: v.string(),
    bio: v.string(),
    avatar: v.string(),
    email: v.string(),
    github: v.string(),
    twitter: v.string(),
    linkedin: v.string(),
    resume: v.optional(v.string()),
    skills: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("profile")
      .withIndex("by_singleton")
      .collect();

    const updatedAt = new Date().toISOString();

    if (profiles.length > 0) {
      const profileId = profiles[0]._id;
      await ctx.db.patch(profileId, {
        ...args,
        updatedAt,
      });
      return profileId;
    } else {
      const profileId = await ctx.db.insert("profile", {
        ...args,
        updatedAt,
      });
      return profileId;
    }
  },
});

/**
 * Update specific fields of the profile
 */
export const update = mutation({
  args: {
    id: v.id("profile"),
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
    resume: v.optional(v.string()),
    email: v.optional(v.string()),
    github: v.optional(v.string()),
    twitter: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return id;
  },
});

/**
 * Add a skill to the profile
 */
export const addSkill = mutation({
  args: {
    id: v.id("profile"),
    skill: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) {
      throw new Error("Profile not found");
    }

    const skills = [...profile.skills, args.skill];
    await ctx.db.patch(args.id, { skills });
    return args.id;
  },
});

/**
 * Remove a skill from the profile
 */
export const removeSkill = mutation({
  args: {
    id: v.id("profile"),
    skill: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) {
      throw new Error("Profile not found");
    }

    const skills = profile.skills.filter((s) => s !== args.skill);
    await ctx.db.patch(args.id, { skills });
    return args.id;
  },
});
