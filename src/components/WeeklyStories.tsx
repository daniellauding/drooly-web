import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface Story {
  id: string;
  name: string;
  avatar: string;
  stories: { id: string; image: string; caption: string }[];
}

interface WeeklyStoriesProps {
  users: Story[];
  onUserClick: (index: number) => void;
}

export function WeeklyStories({ users, onUserClick }: WeeklyStoriesProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4 p-4">
        {users.map((user, index) => (
          <div 
            key={user.id} 
            className="text-center cursor-pointer"
            onClick={() => onUserClick(index)}
          >
            <div className="relative mb-2">
              <Avatar className="w-16 h-16 ring-2 ring-primary p-0.5 hover:ring-offset-2 transition-all">
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