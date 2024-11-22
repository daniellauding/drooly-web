import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface StoryUser {
  id: string;
  name: string;
  avatar: string;
}

const SAMPLE_USERS: StoryUser[] = [
  { id: "1", name: "Sarah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
  { id: "2", name: "Mike", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" },
  { id: "3", name: "Emma", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
  { id: "4", name: "John", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
  { id: "5", name: "Lisa", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&q=80" },
];

export function WeeklyStories() {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4 p-4">
        {SAMPLE_USERS.map((user) => (
          <div key={user.id} className="text-center">
            <div className="relative mb-2">
              <Avatar className="w-16 h-16 ring-2 ring-primary p-0.5 cursor-pointer hover:ring-offset-2 transition-all">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-sm text-muted-foreground">{user.name}</span>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}