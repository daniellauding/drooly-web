import { User } from "./types";
import {
  TableCell,
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
  SelectSeparator,
} from "@/components/ui/select";
import { MessageSquare, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState } from "react";
import { EditRoleModal } from "./EditRoleModal";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { UserInviteStatus } from "./UserInviteStatus";
import { UserVerificationStatus } from "./UserVerificationStatus";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";

interface UserTableRowProps {
  user: User;
  editingId: string | null;
  editName: string;
  availableRoles: string[];
  onEdit: (id: string) => void;
  onEditNameChange: (name: string) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onRoleChange: (id: string, role: string) => void;
  onDelete: (id: string) => void;
  onMessageOpen: (id: string, email: string) => void;
  onToggleExpand: (id: string) => void;
  onAddCustomRole: () => void;
  isExpanded: boolean;
}

export function UserTableRow({
  user,
  editingId,
  editName,
  availableRoles,
  onEdit,
  onEditNameChange,
  onEditSave,
  onEditCancel,
  onRoleChange,
  onDelete,
  onMessageOpen,
  onToggleExpand,
  onAddCustomRole,
  isExpanded,
}: UserTableRowProps) {
  const { toast } = useToast();
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleResendVerification = async () => {
    try {
      // Get the user from Firebase Auth
      const firebaseUser = await auth.getUser(user.id);
      if (!firebaseUser) {
        throw new Error("User not found");
      }

      // Send verification email
      await sendEmailVerification(firebaseUser);
      
      toast({
        title: "Verification email sent",
        description: "A new verification email has been sent to the user.",
      });
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      
      let errorMessage = "Failed to send verification email.";
      if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  return (
    <TableRow>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {user.id}
      </TableCell>
      <TableCell>
        {editingId === user.id ? (
          <div className="flex gap-2">
            <Input
              value={editName}
              onChange={(e) => onEditNameChange(e.target.value)}
              className="w-full"
            />
            <Button size="sm" onClick={() => onEditSave(user.id)}>Save</Button>
            <Button size="sm" variant="outline" onClick={onEditCancel}>Cancel</Button>
          </div>
        ) : (
          <span 
            className="cursor-pointer hover:underline"
            onClick={() => onEdit(user.id)}
          >
            {user.name}
          </span>
        )}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Select
          value={user.role}
          onValueChange={(value) => {
            if (value === "add-custom-role") {
              onAddCustomRole();
            } else {
              onRoleChange(user.id, value);
            }
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
            <SelectSeparator />
            <SelectItem value="add-custom-role" className="text-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Role
            </SelectItem>
          </SelectContent>
        </Select>
        <UserInviteStatus invites={user.invites} />
      </TableCell>
      <TableCell>
        <UserVerificationStatus 
          user={user} 
          onResendVerification={handleResendVerification}
        />
      </TableCell>
      <TableCell>
        {user.lastLoginAt ? format(new Date(user.lastLoginAt), 'PPp') : 'Never'}
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
            onClick={() => onMessageOpen(user.id, user.email)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleExpand(user.id)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </TableCell>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => onDelete(user.id)}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </TableRow>
  );
}