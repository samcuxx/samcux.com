"use client";

import { ExternalLink, Github } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: {
    _id: string;
    slug: string;
    title: string;
    description: string;
    thumbnail: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    updatedAt: number;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/projects/${project.slug}`);
  };

  const handleExternalLinkClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    url: string
  ) => {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleCardClick}
      className="group border rounded-lg overflow-hidden flex flex-col h-full bg-background hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-4 flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-4">
          {project.technologies.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Updated {formatDate(project.updatedAt)}</span>
          <div className="flex gap-2">
            {project.githubUrl && (
              <button
                type="button"
                className="p-1 hover:text-primary"
                onClick={(e) => handleExternalLinkClick(e, project.githubUrl!)}
                aria-label="View GitHub repository"
              >
                <Github className="h-4 w-4" />
              </button>
            )}
            {project.liveUrl && (
              <button
                type="button"
                className="p-1 hover:text-primary"
                onClick={(e) => handleExternalLinkClick(e, project.liveUrl!)}
                aria-label="View live site"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
