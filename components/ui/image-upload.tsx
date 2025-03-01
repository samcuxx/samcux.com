"use client";

import { useState, useTransition } from "react";
import { X, Upload, AlertCircle } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (url: string) => void;
  disabled?: boolean;
  endpoint: "projectImage" | "projectThumbnail" | "profileAvatar";
  projectSlug?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  onRemove,
  disabled,
  endpoint,
  projectSlug = "default",
}: ImageUploadProps) => {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      startTransition(() => {
        if (!res || res.length === 0) {
          setUploadError("Upload completed but no file was returned");
          setPreview(null);
          return;
        }

        // Extract URLs from response, handling different response formats
        let urls: string[] = [];

        // Try to extract URLs from different possible response formats
        for (const file of res) {
          if (file?.url) {
            urls.push(file.url);
          } else if (file?.fileUrl) {
            urls.push(file.fileUrl);
          } else if (typeof file === "string") {
            urls.push(file);
          } else if (file?.data?.url) {
            urls.push(file.data.url);
          } else if (file?.data?.fileUrl) {
            urls.push(file.data.fileUrl);
          }
        }


        if (urls.length === 0) {
          // If we couldn't extract URLs using known properties, try to stringify the response
          const responseStr = JSON.stringify(res);
          const urlMatches = responseStr.match(/"(https:\/\/[^"]+)"/g);

          if (urlMatches) {
            urls = urlMatches.map((match) => match.replace(/"/g, ""));
          } else {
            setUploadError("Upload completed but no valid URLs were returned");
            setPreview(null);
            return;
          }
        }

        // For single image endpoints (profileAvatar, projectThumbnail), replace the existing value
        if (endpoint === "profileAvatar" || endpoint === "projectThumbnail") {
          onChange(urls.slice(0, 1)); // Only use the first URL
        } else {
          onChange([...value, ...urls]);
        }

        setPreview(null);
        setUploadError(null);
      });
    },
    onUploadError: (error) => {
      console.error("Error uploading:", error);
      setUploadError(error.message || "Failed to upload image");
      setPreview(null);
    },
  });

  const isLoading = isUploading || isPending;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadError(null);

      // Validate file size (max 4MB)
      if (file.size > 4 * 1024 * 1024) {
        setUploadError("File size exceeds 4MB limit");
        e.target.value = "";
        return;
      }

      // Create a preview
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);

      // Prepare file with slug-based name if available
      const fileToUpload = file;

      // Add custom headers for the upload
      const headers = {
        "x-project-slug": projectSlug,
      };

      // Upload the file with custom headers
      try {
        startUpload([fileToUpload], { headers });
      } catch (err) {
        console.error("Error starting upload:", err);
        setUploadError("Failed to start upload");
        setPreview(null);
      }

      // Reset the input
      e.target.value = "";
    }
  };

  const handleImageError = (url: string) => {
    setImageErrors((prev) => ({ ...prev, [url]: true }));
  };

  // Determine if this is a single image upload (avatar or thumbnail)
  const isSingleImage =
    endpoint === "profileAvatar" || endpoint === "projectThumbnail";

  // Determine the appropriate size for the image container
  const imageSize = isSingleImage
    ? "h-[150px] w-[150px]"
    : "h-[200px] w-[200px]";

  // Determine the appropriate label text based on the endpoint
  const getLabelText = () => {
    if (endpoint === "profileAvatar") return "Upload avatar";
    if (endpoint === "projectThumbnail") return "Upload thumbnail";
    return "Upload images";
  };

  return (
    <div className="mb-4">
      <div className="mb-4 flex flex-wrap gap-4">
        {value && value.length > 0 ? (
          value.map((url) => (
            <div
              key={url}
              className={`relative ${imageSize} ${isSingleImage ? "rounded-full overflow-hidden" : "rounded-md"}`}
            >
              <div className="absolute right-2 top-2 z-10">
                <button
                  type="button"
                  onClick={() => onRemove(url)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 p-1 text-white"
                  disabled={disabled}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {imageErrors[url] ? (
                <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-md">
                  <div className="text-center p-4">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                    <span className="text-sm text-gray-500">
                      Image not available
                    </span>
                    <div className="text-xs text-gray-400 mt-1 break-all">
                      {url.length > 30 ? url.substring(0, 30) + "..." : url}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <img
                    src={url}
                    alt="Upload"
                    className={`object-cover h-full w-full ${isSingleImage ? "rounded-full" : "rounded-md"}`}
                    onError={() => handleImageError(url)}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No{" "}
            {isSingleImage
              ? endpoint === "profileAvatar"
                ? "avatar"
                : "thumbnail"
              : "images"}{" "}
            uploaded yet
          </div>
        )}
        {preview && (
          <div
            className={`relative ${imageSize} ${isSingleImage ? "rounded-full overflow-hidden" : "rounded-md"}`}
          >
            <img
              src={preview}
              alt="Preview"
              className={`object-cover h-full w-full opacity-50 ${isSingleImage ? "rounded-full" : "rounded-md"}`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-md bg-black bg-opacity-50 p-2 text-white">
                Uploading...
              </div>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {uploadError}
          </div>
        </div>
      )}

      <label
        className={`flex ${imageSize} cursor-pointer flex-col items-center justify-center gap-1 ${isSingleImage ? "rounded-full" : "rounded-md"} border border-dashed p-4 text-sm text-muted-foreground hover:bg-primary/5 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Upload className="h-6 w-6" />
        <span>{isLoading ? "Uploading..." : getLabelText()}</span>
        <span className="text-xs text-gray-400">
          Max{" "}
          {endpoint === "profileAvatar" || endpoint === "projectThumbnail"
            ? "2MB"
            : "4MB"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading || disabled}
        />
      </label>
    </div>
  );
};
