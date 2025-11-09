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

const mockEmails = [
  {
    id: "1",
    from: "customer@example.com",
    subject: "Question about product availability",
    message: "Hi, I was wondering if the wireless headphones are still in stock? I'd like to order 5 units for my team.",
    isRead: false,
    receivedAt: "2 hours ago",
  },
  {
    id: "2",
    from: "support@vendor.com",
    subject: "Order #12345 shipping delay",
    message: "We regret to inform you that there will be a slight delay in shipping your order due to weather conditions.",
    isRead: false,
    receivedAt: "5 hours ago",
  },
  {
    id: "3",
    from: "john.smith@company.com",
    subject: "Partnership opportunity",
    message: "Hello, I represent a company interested in partnering with you for our upcoming product launch.",
    isRead: true,
    receivedAt: "Yesterday",
  },
  {
    id: "4",
    from: "feedback@customer.com",
    subject: "Great service!",
    message: "Just wanted to say thank you for the excellent customer service. The product arrived quickly and works perfectly.",
    isRead: true,
    receivedAt: "2 days ago",
  },
  {
    id: "5",
    from: "inquiry@business.com",
    subject: "Bulk order pricing",
    message: "We're interested in placing a bulk order of 100+ units. Can you provide pricing information and delivery timeframe?",
    isRead: true,
    receivedAt: "3 days ago",
  },
];

export default function Emails() {
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
            data-testid="input-search"
          />
        </div>
        <Select defaultValue="all">
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

      <div className="space-y-3">
        {mockEmails.map((email) => (
          <EmailPreview
            key={email.id}
            {...email}
            onClick={() => console.log("Open email", email.id)}
          />
        ))}
      </div>
    </div>
  );
}
