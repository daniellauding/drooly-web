import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSend: (text: string, replyToId?: string) => void;
  replyTo?: {
    id: string;
    text: string;
  } | null;
  onCancelReply?: () => void;
}

export function MessageInput({ onSend, replyTo, onCancelReply }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message, replyTo?.id);
    setMessage("");
  };

  return (
    <div className="p-4 border-t">
      {replyTo && (
        <div className="mb-2 p-2 bg-muted rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Replying to:</span>
            <span className="text-sm truncate">{replyTo.text}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
          >
            Cancel
          </Button>
        </div>
      )}
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="min-h-[80px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}