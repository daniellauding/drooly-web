import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
      const usersSnapshot = await getDocs(usersRef);
      const users = usersSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          return (
            data.email?.toLowerCase().includes(lowerQuery) ||
            data.name?.toLowerCase().includes(lowerQuery) ||
            data.username?.toLowerCase().includes(lowerQuery)
          );
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));

      // Search recipes
      const recipesRef = collection(db, "recipes");
      const recipesSnapshot = await getDocs(recipesRef);
      const recipes = recipesSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          return data.title?.toLowerCase().includes(lowerQuery);
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));

      // Search events
      const eventsRef = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsRef);
      const events = eventsSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          return data.title?.toLowerCase().includes(lowerQuery);
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));

      console.log('Search results:', { users, recipes, events });
      return { users, recipes, events };
    },
    enabled: searchQuery.length >= 2,
  });

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
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
                      onOpenChange(false);
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
                      onOpenChange(false);
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
                      onOpenChange(false);
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
  );
}