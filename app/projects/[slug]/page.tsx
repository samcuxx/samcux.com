"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Github, Globe } from "lucide-react";
import { notFound } from "next/navigation";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const unwrappedParams = React.use(params);
  const project = useQuery(api.projects.getBySlug, {
    slug: unwrappedParams.slug,
  });

  // Show loading state
  if (project === undefined) {
    return (
      <div className="container py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show 404 if project not found
  if (project === null) {
    notFound();
  }

  return (
    <div className="container py-12">
      <Link
        href="/projects"
        className="inline-flex items-center text-sm hover:underline mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-muted-foreground mb-6">{project.description}</p>

          <div className="aspect-video overflow-hidden rounded-lg bg-muted mb-8">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: project.content }} />
          </div>

          {project.images.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video overflow-hidden rounded-lg bg-muted"
                  >
                    <img
                      src={image}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">
                  Last Updated
                </h3>
                <p className="mt-1">{formatDate(project.updatedAt)}</p>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Source Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Live Site
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
