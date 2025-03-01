"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { User, Mail, Edit } from "lucide-react";

export default function AdminDashboard() {
  const projects = useQuery(api.projects.getAll);
  const messages = useQuery(api.contact.getUnread);
  const profile = useQuery(api.profile.get);

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Profile Card */}
      <div className="mb-12 p-6 rounded-lg border bg-card shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name || "Profile"}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/10"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">
              {profile === undefined ? (
                <span className="animate-pulse">Loading...</span>
              ) : profile === null ? (
                "Welcome to Your Portfolio"
              ) : (
                profile.name
              )}
            </h2>
            <p className="text-muted-foreground">
              {profile === undefined ? (
                <span className="animate-pulse">...</span>
              ) : profile === null ? (
                "Set up your profile to get started"
              ) : (
                profile.title
              )}
            </p>
            {profile?.email && (
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/admin/profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Edit className="h-4 w-4" />
              {profile === null ? "Create Profile" : "Edit Profile"}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <p className="text-3xl font-bold">
            {projects === undefined ? (
              <span className="animate-pulse">...</span>
            ) : (
              projects.length
            )}
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/admin/projects"
              className="text-sm text-primary hover:underline"
            >
              Manage Projects
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/admin/projects/new"
              className="text-sm text-primary hover:underline"
            >
              Add New
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Unread Messages</h2>
          <p className="text-3xl font-bold">
            {messages === undefined ? (
              <span className="animate-pulse">...</span>
            ) : (
              messages.length
            )}
          </p>
          <div className="mt-4">
            <Link
              href="/admin/messages"
              className="text-sm text-primary hover:underline"
            >
              View Messages
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <p className="text-3xl font-bold">
            {profile === undefined ? (
              <span className="animate-pulse">...</span>
            ) : profile === null ? (
              "0"
            ) : (
              profile.skills?.length || 0
            )}
          </p>
          <div className="mt-4">
            <Link
              href="/admin/profile"
              className="text-sm text-primary hover:underline"
            >
              Manage Skills
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
          {projects === undefined ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-card">
              <p className="text-muted-foreground">No projects yet</p>
              <Link
                href="/admin/projects/new"
                className="mt-2 inline-block text-sm text-primary hover:underline"
              >
                Add your first project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project._id}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-card"
                >
                  <div className="w-16 h-16 rounded-md bg-muted overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{project.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {project.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(project.updatedAt)}
                    </p>
                  </div>
                  <Link
                    href={`/admin/projects/${project._id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              ))}
              {projects.length > 5 && (
                <Link
                  href="/admin/projects"
                  className="block text-center text-sm text-primary hover:underline"
                >
                  View all projects
                </Link>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Messages</h2>
          {messages === undefined ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-card">
              <p className="text-muted-foreground">No unread messages</p>
              <Link
                href="/admin/messages"
                className="mt-2 inline-block text-sm text-primary hover:underline"
              >
                View all messages
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.slice(0, 5).map((message) => (
                <div
                  key={message._id}
                  className="p-4 border rounded-lg bg-card"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{message.subject}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      New
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    From: {message.name} ({message.email})
                  </p>
                  <p className="text-sm line-clamp-2">{message.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(message.createdAt)}
                    </p>
                    <Link
                      href={`/admin/messages/${message._id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
              {messages.length > 5 && (
                <Link
                  href="/admin/messages"
                  className="block text-center text-sm text-primary hover:underline"
                >
                  View all messages
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
