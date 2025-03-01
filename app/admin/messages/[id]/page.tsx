"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

export default function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const messageId = unwrappedParams.id as Id<"messages">;

  const router = useRouter();
  const message = useQuery(api.contact.getById, { id: messageId });
  const markAsRead = useMutation(api.contact.markAsRead);
  const deleteMessage = useMutation(api.contact.deleteMessage);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (message && !message.read) {
      markAsRead({ id: messageId });
    }
  }, [message, markAsRead, messageId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setLoading((prev) => ({ ...prev, delete: true }));
    try {
      await deleteMessage({ id: messageId });
      router.push("/admin/messages");
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  if (message === undefined) {
    return (
      <div className="container py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (message === null) {
    return (
      <div className="container py-12">
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/admin/messages"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Messages</span>
          </Link>
        </div>
        <div className="text-center py-16 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Message not found</h2>
          <p className="text-muted-foreground">
            The message you are looking for does not exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/admin/messages"
          className="flex items-center gap-1 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Messages</span>
        </Link>
      </div>

      <div className="p-6 border rounded-lg bg-card shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{message.subject}</h1>
            <p className="text-muted-foreground mt-1">
              From: {message.name} ({message.email})
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Received: {formatDate(message.createdAt)}
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={loading.delete}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            {loading.delete ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span>Delete</span>
          </button>
        </div>

        <div className="bg-muted p-6 rounded-md my-6">
          <p className="whitespace-pre-wrap">{message.message}</p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
              <CheckCircle className="h-3 w-3" />
              <span>Read</span>
            </span>
          </div>

          <Link
            href={`mailto:${message.email}?subject=Re: ${message.subject}`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Reply via Email
          </Link>
        </div>
      </div>
    </div>
  );
}
