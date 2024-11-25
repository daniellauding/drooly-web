import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/components/backoffice/types';

export function useUserManagement(searchQuery: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const fetchedUsers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];

        // Apply search filter
        const filteredUsers = searchQuery
          ? fetchedUsers.filter(user =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.id.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : fetchedUsers;

        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch users. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, toast]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(user => user.id !== id));
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted."
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again."
      });
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', id), { role: newRole });
      setUsers(users.map(user =>
        user.id === id ? { ...user, role: newRole } : user
      ));
      toast({
        title: "Role updated",
        description: "User role has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role. Please try again."
      });
    }
  };

  const handleEdit = async (id: string) => {
    try {
      await updateDoc(doc(db, 'users', id), { name: editName });
      setUsers(users.map(user =>
        user.id === id ? { ...user, name: editName } : user
      ));
      setEditingId(null);
      toast({
        title: "Name updated",
        description: "User name has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating user name:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user name. Please try again."
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