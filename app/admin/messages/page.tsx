"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Mail, Search } from "lucide-react";

export default function MessagesPage() {
  const messages = useQuery(api.contact.getAll);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMessages = messages?.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Messages</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {messages === undefined ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-card">
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
          <p className="text-muted-foreground">
            When someone contacts you, their messages will appear here.
          </p>
        </div>
      ) : filteredMessages?.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-card">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground">
            No messages match your search criteria.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 p-4 font-semibold border-b text-muted-foreground">
            <div className="col-span-3 md:col-span-2">Date</div>
            <div className="col-span-4 md:col-span-3">From</div>
            <div className="col-span-5 md:col-span-5">Subject</div>
            <div className="hidden md:block md:col-span-2">Status</div>
          </div>

          {filteredMessages?.map((message) => (
            <Link
              key={message._id}
              href={`/admin/messages/${message._id}`}
              className={`grid grid-cols-12 gap-4 p-4 border rounded-lg bg-card hover:border-primary transition-colors ${
                !message.read ? "border-primary/50" : ""
              }`}
            >
              <div className="col-span-3 md:col-span-2 text-sm text-muted-foreground">
                {formatDate(message.createdAt)}
              </div>
              <div className="col-span-4 md:col-span-3 truncate">
                <div className="font-medium">{message.name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {message.email}
                </div>
              </div>
              <div className="col-span-5 md:col-span-5">
                <div
                  className={`truncate ${!message.read ? "font-semibold" : ""}`}
                >
                  {message.subject}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {message.message}
                </div>
              </div>
              <div className="hidden md:block md:col-span-2">
                {!message.read ? (
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    Unread
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                    Read
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
