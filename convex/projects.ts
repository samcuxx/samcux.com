import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Get all projects
 */
export const getAll = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").order("desc").collect();
    return projects;
  },
});

/**
 * Get a project by ID
 */
export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    return project;
  },
});

/**
 * Get featured projects
 */
export const getFeatured = query({
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .order("desc")
      .collect();
    return projects;
  },
});

/**
 * Get a project by slug
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();
    return projects.length > 0 ? projects[0] : null;
  },
});

/**
 * Create a new project
 */
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.string(),
    thumbnail: v.string(),
    images: v.array(v.string()),
    technologies: v.array(v.string()),
    githubUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();

    if (existing.length > 0) {
      throw new Error(`A project with slug "${args.slug}" already exists`);
    }

    const now = Date.now();

    const projectId = await ctx.db.insert("projects", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return projectId;
  },
});

/**
 * Update a project
 */
export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    technologies: v.optional(v.array(v.string())),
    githubUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;

    // Get the current project to ensure it exists
    const existingProject = await ctx.db.get(id);
    if (!existingProject) {
      throw new Error(`Project with ID "${id}" not found`);
    }

    // If slug is being updated, check if it already exists
    if (fields.slug !== undefined) {
      const slugToCheck = fields.slug;
      const existingWithSlug = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", slugToCheck))
        .collect();

      if (existingWithSlug.length > 0 && existingWithSlug[0]._id !== id) {
        throw new Error(`A project with slug "${slugToCheck}" already exists`);
      }
    }

    // Create an update object with only the fields that are provided
    const updateFields: Record<string, any> = {
      ...fields,
      updatedAt: Date.now(),
    };

    // Apply the update
    await ctx.db.patch(id, updateFields);

    return id;
  },
});

/**
 * Delete a project
 */
export const remove = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
