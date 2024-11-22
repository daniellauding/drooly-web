import { MessageCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

interface EventDiscussionProps {
  messages: Message[];
}

export function EventDiscussion({ messages }: EventDiscussionProps) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
        <MessageCircle className="h-4 w-4" />
        Discussion
      </h4>
      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{message.sender}</span>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{message.text}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}