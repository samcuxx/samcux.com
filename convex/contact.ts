import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Submit a contact form message
 */
export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      ...args,
      read: false,
      createdAt: new Date().toISOString(),
    });
    return messageId;
  },
});

/**
 * Get all messages
 */
export const getAll = query({
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
    return messages;
  },
});

/**
 * Get a single message by ID
 */
export const getById = query({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.id);
    return message;
  },
});

/**
 * Get unread messages
 */
export const getUnread = query({
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("read"), false))
      .order("desc")
      .collect();
    return messages;
  },
});

/**
 * Mark a message as read
 */
export const markAsRead = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
    return args.id;
  },
});

/**
 * Delete a message
 */
export const deleteMessage = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
