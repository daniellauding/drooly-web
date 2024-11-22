import { Clock } from "lucide-react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  user: string;
  avatar: string;
}

interface EventTimelineProps {
  events: TimelineEvent[];
}

export function EventTimeline({ events }: EventTimelineProps) {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="relative pl-8 pb-6">
            <div className="absolute left-0 top-0 h-full w-px bg-gray-200" />
            <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-primary" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <Card className="mt-2 p-4">
              <div className="flex items-start gap-3">
                <img
                  src={event.avatar}
                  alt={event.user}
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <p className="font-medium text-sm">{event.user}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.description}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}