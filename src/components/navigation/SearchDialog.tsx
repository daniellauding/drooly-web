import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
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

  const { data: searchResults = { users: [], recipes: [] }, isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) {
        return { users: [], recipes: [] };
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
            data.name?.toLowerCase().includes(lowerQuery)
          );
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));

      // Search recipes
      const recipesRef = collection(db, "recipes");
      const recipesSnapshot = await getDocs(recipesRef);
      const recipes = recipesSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          return (
            data.title?.toLowerCase().includes(lowerQuery) ||
            data.description?.toLowerCase().includes(lowerQuery) ||
            data.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
          );
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));

      console.log('Search results:', { users, recipes });
      return { users, recipes };
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
        {isLoading ? (
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
                        {user.email}
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
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}