import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profile: defineTable({
    name: v.string(),
    title: v.string(),
    bio: v.string(),
    avatar: v.string(), // URL to image
    resume: v.optional(v.string()), // URL to resume
    email: v.string(),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    socialLinks: v.optional(
      v.array(
        v.object({
          platform: v.string(), // e.g., "github", "linkedin"
          url: v.string(),
        })
      )
    ),
    skills: v.array(v.string()),
    github: v.string(),
    twitter: v.string(),
    linkedin: v.string(),
    updatedAt: v.string(),
  }).index("by_singleton", ["updatedAt"]),

  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.string(), // Rich text content
    thumbnail: v.string(), // URL to image
    images: v.array(v.string()), // URLs to additional images
    technologies: v.array(v.string()),
    githubUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(), // For custom ordering
    createdAt: v.number(), // Timestamp
    updatedAt: v.number(), // Timestamp
  })
    .index("by_featured", ["featured"])
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

  messages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_read", ["read"])
    .index("by_createdAt", ["createdAt"]),

  settings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),
});
