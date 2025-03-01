"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Mail, Github, Twitter, Linkedin, FileText, User } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const profile = useQuery(api.profile.get);

  if (profile === undefined) {
    return (
      <div className="container py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="container py-12">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-muted-foreground">
            Profile information coming soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-primary/10"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-muted flex items-center justify-center">
                <User className="h-20 w-20 text-muted-foreground" />
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
          <p className="text-xl text-muted-foreground mb-6">{profile.title}</p>

          <div className="flex justify-center gap-4 mb-8">
            {profile.github && (
              <Link
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-primary" />
              </Link>
            )}
            {profile.twitter && (
              <Link
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-primary" />
              </Link>
            )}
            {profile.linkedin && (
              <Link
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-primary" />
              </Link>
            )}
            {profile.email && (
              <Link
                href={`mailto:${profile.email}`}
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-primary" />
              </Link>
            )}
            {profile.resume && (
              <Link
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="Resume"
              >
                <FileText className="h-5 w-5 text-primary" />
              </Link>
            )}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">About Me</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
