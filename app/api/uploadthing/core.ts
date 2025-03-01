import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define routes for different types of uploads
  projectImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async ({ req }) => {
      // Extract project slug from request headers if available
      const projectSlug = req.headers.get("x-project-slug") || "project";

      return {
        userId: "admin",
        projectSlug,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Use the correct URL property based on UploadThing version
      const fileUrl = file.ufsUrl || file.url;

      // Return both URL formats to ensure compatibility
      return {
        fileUrl: fileUrl,
        url: fileUrl,
      };
    }),

  // Route specifically for project thumbnails
  projectThumbnail: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Extract project slug from request headers if available
      const projectSlug = req.headers.get("x-project-slug") || "thumbnail";

      return {
        userId: "admin",
        projectSlug,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Use the correct URL property based on UploadThing version
      const fileUrl = file.ufsUrl || file.url;

      // Return both URL formats to ensure compatibility
      return {
        fileUrl: fileUrl,
        url: fileUrl,
      };
    }),

  // Route specifically for profile avatar
  profileAvatar: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      return {
        userId: "admin",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Use the correct URL property based on UploadThing version
      const fileUrl = file.ufsUrl || file.url;

      // Return both URL formats to ensure compatibility
      return {
        fileUrl: fileUrl,
        url: fileUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
