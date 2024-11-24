import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  avatarUrl: string | null;
  devicePlatform: string;
  role: string;
  followers: string[];
  following: string[];
  savedRecipes: string[];
  pushToken: string;
  createdAt: any; // Firebase Timestamp
}

interface UserSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserSearchDialog({ open, onOpenChange }: UserSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      console.log("Fetching users with query:", searchQuery);
      if (!searchQuery) return [];
      
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", ">=", searchQuery),
        where("email", "<=", searchQuery + "\uf8ff")
      );
      
      const snapshot = await getDocs(q);
      console.log("Found users:", snapshot.size);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
    },
    enabled: searchQuery.length > 0,
  });

  const handleSelectUser = async (user: User) => {
    console.log("Selected user:", user);
    toast({
      title: "Coming Soon",
      description: `Starting a conversation with ${user.email} will be available soon!`,
    });
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search users by email..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No users found.</CommandEmpty>
        <CommandGroup heading="Users">
          {users.map((user) => (
            <CommandItem
              key={user.id}
              onSelect={() => handleSelectUser(user)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Avatar className="h-8 w-8">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.email} />
                ) : (
                  <AvatarFallback>
                    {user.email[0].toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  {user.role} • {user.followers?.length || 0} followers
                </p>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}