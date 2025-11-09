import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen } from "lucide-react";

interface EmailPreviewProps {
  id: string;
  from: string;
  subject: string;
  message: string;
  isRead: boolean;
  receivedAt: string;
  onClick?: () => void;
}

export function EmailPreview({
  id,
  from,
  subject,
  message,
  isRead,
  receivedAt,
  onClick,
}: EmailPreviewProps) {
  return (
    <Card
      className={`cursor-pointer hover-elevate ${!isRead ? "border-primary/50" : ""}`}
      onClick={onClick}
      data-testid={`card-email-${id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {isRead ? (
              <MailOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className={`text-sm truncate ${!isRead ? "font-semibold" : ""}`} data-testid={`text-from-${id}`}>
                {from}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground flex-shrink-0" data-testid={`text-time-${id}`}>
            {receivedAt}
          </p>
        </div>
        <h4 className={`text-sm mt-1 ${!isRead ? "font-semibold" : ""}`} data-testid={`text-subject-${id}`}>
          {subject}
        </h4>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-message-${id}`}>
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
