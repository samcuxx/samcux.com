"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { ImageUpload } from "@/components/ui/image-upload";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const projectId = unwrappedParams.id as Id<"projects">;

  const project = useQuery(api.projects.getById, { id: projectId });
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.remove);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    thumbnail: "",
    technologies: [] as string[],
    githubUrl: "",
    liveUrl: "",
    featured: false,
    images: [] as string[],
  });

  const [techInput, setTechInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load project data when available
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        slug: project.slug,
        description: project.description,
        content: project.content,
        thumbnail: project.thumbnail,
        technologies: project.technologies,
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        featured: project.featured,
        images: project.images || [],
      });
    }
  }, [project]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.slug ||
        !formData.description ||
        !formData.thumbnail
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate slug format
      if (!/^[a-z0-9-]+$/.test(formData.slug)) {
        throw new Error(
          "Slug can only contain lowercase letters, numbers, and hyphens"
        );
      }

      await updateProject({
        id: projectId,
        ...formData,
      });

      router.push("/admin/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteProject({ id: projectId });
      router.push("/admin/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!project) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Link
        href="/admin/projects"
        className="inline-flex items-center text-sm hover:underline mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Edit Project</h1>
        <div className="text-sm text-muted-foreground">
          Last updated:{" "}
          {project.updatedAt ? formatDate(project.updatedAt) : "N/A"}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  pattern="^[a-z0-9-]+$"
                  className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="project-name"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80"
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Used in the URL: /projects/your-slug
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Thumbnail <span className="text-red-500">*</span>
              </label>
              <ImageUpload
                value={formData.thumbnail ? [formData.thumbnail] : []}
                onChange={(urls) => {
                  if (urls.length > 0) {
                    setFormData((prev) => ({ ...prev, thumbnail: urls[0] }));
                  }
                }}
                onRemove={() => {
                  setFormData((prev) => ({ ...prev, thumbnail: "" }));
                }}
                endpoint="projectThumbnail"
                projectSlug={formData.slug || "thumbnail"}
              />
              {!formData.thumbnail && (
                <p className="text-xs text-red-500 mt-1">
                  A thumbnail image is required
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="githubUrl"
                className="block text-sm font-medium mb-1"
              >
                GitHub URL
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div>
              <label
                htmlFor="liveUrl"
                className="block text-sm font-medium mb-1"
              >
                Live URL
              </label>
              <input
                type="url"
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured Project
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="A brief description of your project"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium mb-1"
              >
                Content (HTML)
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                placeholder="<p>Detailed description of your project...</p>"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Technologies
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.technologies.map((tech) => (
                  <div
                    key={tech}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="text-primary/70 hover:text-primary"
                      aria-label={`Remove ${tech}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Add a technology (e.g. React, Node.js)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Project Images
              </label>
              <ImageUpload
                value={formData.images}
                onChange={(urls) => {
                  setFormData((prev) => ({ ...prev, images: urls }));
                }}
                onRemove={(url) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: prev.images.filter((image) => image !== url),
                  }));
                }}
                endpoint="projectImage"
                projectSlug={formData.slug || "project"}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Project</span>
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/projects")}
              className="px-6 py-2 border rounded-md hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Project</h3>
            <p className="mb-6">
              Are you sure you want to delete "{project.title}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded-md"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
