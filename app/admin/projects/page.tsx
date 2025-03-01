"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Plus, Search, Trash2, RefreshCw } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export default function ProjectsPage() {
  const projects = useQuery(api.projects.getAll);
  const deleteProject = useMutation(api.projects.deleteProject);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const filteredProjects = projects?.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleDelete = async (id: Id<"projects">) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteProject({ id });
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Projects</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            href="/admin/projects/new"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 w-full md:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {projects === undefined ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first project to showcase your work.
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span>Create Project</span>
          </Link>
        </div>
      ) : filteredProjects?.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-card">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground">
            No projects match your search criteria.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects?.map((project) => (
            <div
              key={project._id}
              className="border rounded-lg overflow-hidden bg-card shadow-sm flex flex-col"
            >
              <div className="h-48 bg-muted relative">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No thumbnail</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                  {project.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.tags || []).slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {(project.tags || []).length > 3 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-auto mb-4">
                  Last updated: {formatDate(project.updatedAt)}
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/admin/projects/${project._id}`}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    disabled={loading[project._id]}
                    className="flex items-center gap-1 text-sm text-destructive hover:underline"
                  >
                    {loading[project._id] ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
