import { Search, Bell, MessageSquare, PlusCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function TopBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch unread messages count
  const { data: unreadMessagesCount = 0 } = useQuery({
    queryKey: ['unreadMessages', user?.uid],
    queryFn: async () => {
      if (!user) return 0;
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("recipientId", "==", user.uid),
        where("read", "==", false)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    },
    enabled: !!user,
  });

  // Fetch notifications count
  const { data: unreadNotificationsCount = 0 } = useQuery({
    queryKey: ['unreadNotifications', user?.uid],
    queryFn: async () => {
      if (!user) return 0;
      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("userId", "==", user.uid),
        where("read", "==", false)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    },
    enabled: !!user,
  });

  // Search functionality
  const { data: searchResults = { users: [], recipes: [], events: [] }, isLoading: searchLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) {
        return { users: [], recipes: [], events: [] };
      }

      console.log('Searching for:', searchQuery);
      const lowerQuery = searchQuery.toLowerCase();

      // Search users
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(query(
        usersRef,
        where("searchTerms", "array-contains", lowerQuery)
      ));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Search recipes
      const recipesRef = collection(db, "recipes");
      const recipesSnapshot = await getDocs(query(
        recipesRef,
        where("searchTerms", "array-contains", lowerQuery)
      ));
      const recipes = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Search events
      const eventsRef = collection(db, "events");
      const eventsSnapshot = await getDocs(query(
        eventsRef,
        where("searchTerms", "array-contains", lowerQuery)
      ));
      const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log('Search results:', { users, recipes, events });
      return { users, recipes, events };
    },
    enabled: searchQuery.length >= 2,
  });

  const handleNotificationsClick = () => {
    toast({
      title: "Coming Soon",
      description: "Notifications feature will be available soon!",
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="flex items-center gap-4 px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/lovable-uploads/e7734f7b-7b98-4c29-9f0f-1cd60bacbfac.png" alt="Recipe App" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-[#2C3E50]">Yummy</h1>
        </div>
        <div className="relative flex-1 max-w-md ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            className="pl-9 bg-[#F7F9FC] border-none rounded-2xl" 
            placeholder="Search recipes, users, events..." 
            onClick={() => setSearchOpen(true)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleNotificationsClick}
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                {unreadNotificationsCount}
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate('/messages')}
          >
            <MessageSquare className="h-5 w-5" />
            {unreadMessagesCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                {unreadMessagesCount}
              </Badge>
            )}
          </Button>
          <Button
            variant="default"
            className="gap-2"
            onClick={() => navigate('/create')}
          >
            <PlusCircle className="h-4 w-4" />
            Create
          </Button>
        </div>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput 
          placeholder="Type to search..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : (
            <>
              {searchResults.users.length > 0 && (
                <CommandGroup heading="Users">
                  {searchResults.users.map((user: any) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => {
                        navigate(`/profile/${user.id}`);
                        setSearchOpen(false);
                      }}
                    >
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.username ? `@${user.username}` : user.email}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.recipes.length > 0 && (
                <CommandGroup heading="Recipes">
                  {searchResults.recipes.map((recipe: any) => (
                    <CommandItem
                      key={recipe.id}
                      onSelect={() => {
                        navigate(`/recipe/${recipe.id}`);
                        setSearchOpen(false);
                      }}
                    >
                      <img
                        src={recipe.images?.[0] || "/placeholder.svg"}
                        alt={recipe.title}
                        className="h-8 w-8 rounded-md object-cover mr-2"
                      />
                      <div>
                        <p className="font-medium">{recipe.title}</p>
                        <p className="text-sm text-muted-foreground">
                          by {recipe.creatorName}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.events.length > 0 && (
                <CommandGroup heading="Events">
                  {searchResults.events.map((event: any) => (
                    <CommandItem
                      key={event.id}
                      onSelect={() => {
                        navigate(`/event/${event.id}`);
                        setSearchOpen(false);
                      }}
                    >
                      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                        🎉
                      </div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}