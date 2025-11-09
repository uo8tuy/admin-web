import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmailPreview } from "@/components/email-preview";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupportEmail } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function Emails() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  
  const { data: emails = [], isLoading } = useQuery<SupportEmail[]>({
    queryKey: ["/admin/emails"],
  });

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !email.isRead) ||
      (filter === "read" && email.isRead);
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-muted-foreground">Loading emails...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="heading-emails">Support Emails</h1>
        <p className="text-muted-foreground mt-1">
          View and manage customer support emails
        </p>
      </div>

      <div className="flex gap-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-filter">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Emails</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredEmails.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {emails.length === 0
            ? "No support emails yet."
            : "No emails match your filters."}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEmails.map((email) => (
            <EmailPreview
              key={email.id}
              id={email.id}
              from={email.from}
              subject={email.subject}
              message={email.message}
              isRead={email.isRead}
              receivedAt={formatDistanceToNow(new Date(email.receivedAt), { addSuffix: true })}
              onClick={() => console.log("Open email", email.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
