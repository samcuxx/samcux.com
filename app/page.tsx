"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/ui/project-card";

export default function HomePage() {
  const featuredProjects = useQuery(api.projects.getFeatured);
  const profile = useQuery(api.profile.get);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {profile?.name || "Hi, I'm a Developer"}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {profile?.tagline ||
                "I build modern web applications with cutting-edge technologies."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90"
              >
                View My Work
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-lg font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Link
              href="/projects"
              className="inline-flex items-center text-primary hover:underline"
            >
              View all projects
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {featuredProjects === undefined ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-background">
              <p className="text-xl text-muted-foreground">
                No featured projects yet
              </p>
              <p className="text-muted-foreground mt-2">
                Check back soon for featured projects.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-10">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add skill cards here */}
          </div>
        </div>
      </section>
    </div>
  );
}
