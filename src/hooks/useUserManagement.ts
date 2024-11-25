import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/components/backoffice/types";

export function useUserManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<string[]>([]);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', searchQuery],
    queryFn: async () => {
      console.log("Fetching users data with search:", searchQuery);
      const usersRef = collection(db, 'users');
      let q = query(usersRef);
      
      if (searchQuery) {
        q = query(usersRef, 
          where('email', '>=', searchQuery),
          where('email', '<=', searchQuery + '\uf8ff')
        );
      }
      
      const snapshot = await getDocs(q);
      
      const usersData = await Promise.all(snapshot.docs.map(async (doc) => {
        const recipesRef = collection(db, 'recipes');
        const recipesQuery = query(recipesRef, where('creatorId', '==', doc.id));
        const recipesSnapshot = await getDocs(recipesQuery);
        
        return {
          id: doc.id,
          ...doc.data(),
          recipes: recipesSnapshot.docs.map(recipeDoc => ({
            id: recipeDoc.id,
            ...recipeDoc.data()
          }))
        };
      }));

      return usersData as User[];
    }
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await deleteDoc(doc(db, "users", id));
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted."
      });
      refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again."
      });
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", id), {
        role: newRole
      });
      toast({
        title: "Role updated",
        description: "The user's role has been successfully updated."
      });
      refetch();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role. Please try again."
      });
    }
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    
    try {
      await updateDoc(doc(db, "users", id), {
        name: editName
      });
      toast({
        title: "User updated",
        description: "The user has been successfully updated."
      });
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user. Please try again."
      });
    }
  };

  const toggleUserExpansion = (id: string) => {
    setExpandedUsers(prev => 
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  return {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    editingId,
    setEditingId,
    editName,
    setEditName,
    expandedUsers,
    handleDelete,
    handleRoleChange,
    handleEdit,
    toggleUserExpansion
  };
}