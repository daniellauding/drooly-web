import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Reply } from "lucide-react";
import { Message as MessageType } from "@/types/chat";

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onReply: (message: MessageType) => void;
  replyToMessage?: MessageType | null;
}

export function MessageComponent({ 
  message, 
  isOwnMessage, 
  onEdit, 
  onDelete, 
  onReply,
  replyToMessage 
}: MessageProps) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (messageId: string) => {
    if (!editText.trim()) return;
    onEdit(messageId, editText);
    setEditingMessageId(null);
    setEditText("");
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className="flex flex-col max-w-[70%]">
        {message.replyTo && (
          <div className="mb-1 p-2 bg-muted rounded-lg text-sm text-muted-foreground">
            Replying to: {replyToMessage?.text || "Deleted message"}
          </div>
        )}
        <div
          className={`rounded-lg p-3 ${
            isOwnMessage
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          {editingMessageId === message.id ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleEdit(message.id)}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingMessageId(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p>{message.text}</p>
              {message.edited && (
                <span className="text-xs opacity-70">(edited)</span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {message.seen && isOwnMessage && (
            <span className="text-xs text-muted-foreground">Seen</span>
          )}
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => onReply(message)}
            >
              <Reply className="h-4 w-4" />
            </Button>
            {isOwnMessage && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => {
                    setEditingMessageId(message.id);
                    setEditText(message.text);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => onDelete(message.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}