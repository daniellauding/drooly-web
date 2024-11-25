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
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [selectedRoleToEdit, setSelectedRoleToEdit] = useState("");

  const handleEditRole = (role: string) => {
    setSelectedRoleToEdit(role);
    setEditRoleModalOpen(true);
  };

  const handleRoleUpdate = (oldRole: string, newRole: string) => {
    // Update all users with the old role to use the new role name
    if (user.role === oldRole) {
      onRoleChange(user.id, newRole);
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
        <div className="flex items-center gap-2">
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
                <SelectItem key={role} value={role} className="flex justify-between">
                  {role}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEditRole(role);
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </SelectItem>
              ))}
              <SelectSeparator />
              <SelectItem value="add-custom-role" className="text-primary">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Custom Role
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            onClick={() => onDelete(user.id)}
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
    </TableRow>
  );
}