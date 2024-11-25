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

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: { seconds: number };
}

export function BackofficeUsers() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
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
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
              </TableCell>
              <TableCell>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}