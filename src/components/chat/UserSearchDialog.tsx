import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
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
import { useNavigate } from "react-router-dom";

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
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

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

  const handleSelectUser = async (selectedUser: User) => {
    if (!currentUser) return;
    
    try {
      console.log("Creating conversation with user:", selectedUser);
      
      // Create a new conversation
      const conversationsRef = collection(db, "conversations");
      const newConversation = await addDoc(conversationsRef, {
        participants: [currentUser.uid, selectedUser.id],
        participantEmails: [currentUser.email, selectedUser.email],
        lastMessage: "",
        lastMessageTimestamp: serverTimestamp(),
        createdAt: serverTimestamp(),
        isGroup: false,
        unreadCount: 0
      });

      console.log("Created new conversation:", newConversation.id);
      
      toast({
        title: "Conversation Created",
        description: `You can now chat with ${selectedUser.email}`,
      });

      // Close the dialog and navigate to messages
      onOpenChange(false);
      navigate('/messages');
      
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive"
      });
    }
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