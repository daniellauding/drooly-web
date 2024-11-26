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
import { MessageSquare, ChevronDown, ChevronUp, Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { EditRoleModal } from "./EditRoleModal";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { UserInviteStatus } from "./UserInviteStatus";
import { format } from "date-fns";
import { CheckCircle2, XCircle, RotateCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

// Split into smaller components for better maintainability
const VerificationStatus = ({ user, onResendVerification }: { user: User, onResendVerification: () => void }) => {
  return (
    <div className="flex items-center gap-2">
      {user.emailVerified ? (
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          <span>Verified</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center text-red-600">
            <XCircle className="h-4 w-4 mr-1" />
            <span>Not verified</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onResendVerification}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

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
  const { sendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [selectedRoleToEdit, setSelectedRoleToEdit] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleResendVerification = async () => {
    try {
      await sendVerificationEmail();
      toast({
        title: "Verification email sent",
        description: "A new verification email has been sent to the user.",
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send verification email.",
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
        <VerificationStatus 
          user={user} 
          onResendVerification={handleResendVerification} 
        />
      </TableCell>
      <TableCell>
        {user.lastLoginAt ? (
          format(new Date(user.lastLoginAt), 'PPp')
        ) : (
          'Never'
        )}
      </TableCell>
      <TableCell>{user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}</TableCell>
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

      <EditRoleModal
        open={editRoleModalOpen}
        onOpenChange={setEditRoleModalOpen}
        onSave={handleRoleUpdate}
        currentRole={selectedRoleToEdit}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? You can undo this action for the next 5 seconds."
      />
    </TableRow>
  );
}
