"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectCard } from "@/components/ui/project-card";

export default function ProjectsPage() {
  const projects = useQuery(api.projects.getAll);
  const [filter, setFilter] = useState<string | null>(null);

  // Extract unique technologies from all projects
  const allTechnologies = projects
    ? Array.from(
        new Set(projects.flatMap((project) => project.technologies))
      ).sort()
    : [];

  // Filter projects based on selected technology
  const filteredProjects = projects
    ? filter
      ? projects.filter((project) => project.technologies.includes(filter))
      : projects
    : [];

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-4">Projects</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
        Explore my portfolio of projects. Each project showcases different
        skills and technologies I&apos;ve worked with.
      </p>

      {/* Technology filter */}
      {allTechnologies.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-medium mb-3">Filter by technology:</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`px-3 py-1.5 rounded-full text-sm ${
                filter === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All
            </button>
            {allTechnologies.map((tech) => (
              <button
                key={tech}
                onClick={() => setFilter(tech)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  filter === tech
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Projects grid */}
      {projects === undefined ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No projects found</p>
          {filter && (
            <button
              onClick={() => setFilter(null)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
