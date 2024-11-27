import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecipeCard } from "@/components/RecipeCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResults {
  users: any[];
  recipes: any[];
}

const INITIAL_SEARCH_RESULTS: SearchResults = {
  users: [],
  recipes: []
};

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults = INITIAL_SEARCH_RESULTS, isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) {
        return INITIAL_SEARCH_RESULTS;
      }

      console.log('Searching for:', searchQuery);
      const lowerQuery = searchQuery.toLowerCase();

      try {
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
      } catch (error) {
        console.error('Error during search:', error);
        return INITIAL_SEARCH_RESULTS;
      }
    },
    enabled: searchQuery.length >= 2,
  });

  const hasResults = (searchResults.users?.length || 0) > 0 || (searchResults.recipes?.length || 0) > 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search recipes, users..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Searching...
          </div>
        ) : !hasResults ? (
          <CommandEmpty className="py-6 text-center text-sm">
            No results found for "{searchQuery}"
          </CommandEmpty>
        ) : (
          <ScrollArea className="h-[400px]">
            {searchResults.users?.length > 0 && (
              <CommandGroup heading="Users" className="p-2">
                {searchResults.users.map((user: any) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => {
                      navigate(`/profile/${user.id}`);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-accent rounded-lg"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{user.name?.[0] || user.email?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searchResults.recipes?.length > 0 && (
              <CommandGroup heading="Recipes" className="p-2">
                <div className="grid gap-4 p-2">
                  {searchResults.recipes.map((recipe: any) => (
                    <CommandItem
                      key={recipe.id}
                      onSelect={() => {
                        navigate(`/recipe/${recipe.id}`);
                        onOpenChange(false);
                      }}
                      className="flex flex-col p-0 cursor-pointer hover:bg-accent rounded-lg overflow-hidden"
                    >
                      <RecipeCard
                        id={recipe.id}
                        title={recipe.title}
                        image={recipe.images?.[recipe.featuredImageIndex || 0]}
                        cookTime={recipe.totalTime}
                        difficulty={recipe.difficulty}
                        chef={recipe.creatorName}
                        date={recipe.createdAt ? new Date(recipe.createdAt.seconds * 1000).toLocaleDateString() : undefined}
                      />
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            )}
          </ScrollArea>
        )}
      </CommandList>
    </CommandDialog>
  );
}