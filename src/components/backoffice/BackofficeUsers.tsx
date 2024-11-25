import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CustomRoleModal } from "./CustomRoleModal";
import { UserMessageModal } from "./UserMessageModal";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: { seconds: number };
  recipes?: any[];
}

export function BackofficeUsers() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [customRoleModalOpen, setCustomRoleModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");
  const [expandedUsers, setExpandedUsers] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([
    "user",
    "admin",
    "superadmin"
  ]);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log("Fetching users data...");
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      // Fetch recipes count for each user
      const usersData = await Promise.all(snapshot.docs.map(async (doc) => {
        const recipesRef = collection(db, 'recipes');
        const recipesSnapshot = await getDocs(query(recipesRef, where('creatorId', '==', doc.id)));
        
        return {
          id: doc.id,
          ...doc.data(),
          recipes: recipesSnapshot.docs.map(recipeDoc => ({
            id: recipeDoc.id,
            ...recipeDoc.data()
          }))
        };
      }));

      console.log("Fetched users data:", usersData);
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

  const handleAddCustomRole = (role: string) => {
    setAvailableRoles(prev => [...prev, role]);
    toast({
      title: "Role added",
      description: `The role "${role}" has been added to the available roles.`
    });
  };

  const toggleUserExpansion = (userId: string) => {
    setExpandedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={() => setCustomRoleModalOpen(true)}
      >
        Add Custom Role
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Recipes</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <>
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {user.id}
                </TableCell>
                <TableCell>
                  {editingId === user.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full"
                      />
                      <Button size="sm" onClick={() => handleEdit(user.id)}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <span 
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        setEditingId(user.id);
                        setEditName(user.name);
                      }}
                    >
                      {user.name}
                    </span>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                </TableCell>
                <TableCell>{user.recipes?.length || 0} recipes</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setSelectedUserEmail(user.email);
                        setMessageModalOpen(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleUserExpansion(user.id)}
                  >
                    {expandedUsers.includes(user.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedUsers.includes(user.id) && (
                <TableRow>
                  <TableCell colSpan={8} className="bg-muted/30 p-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">User's Recipes</h3>
                      {user.recipes && user.recipes.length > 0 ? (
                        <div className="grid gap-4">
                          {user.recipes.map((recipe: any) => (
                            <div key={recipe.id} className="p-4 bg-background rounded-lg">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{recipe.title}</h4>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(recipe.createdAt.seconds * 1000).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {recipe.description || 'No description'}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No recipes created yet</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>

      <CustomRoleModal
        open={customRoleModalOpen}
        onOpenChange={setCustomRoleModalOpen}
        onSave={handleAddCustomRole}
      />

      <UserMessageModal
        open={messageModalOpen}
        onOpenChange={setMessageModalOpen}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
      />
    </div>
  );
}