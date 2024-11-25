import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CustomRoleModal } from "./CustomRoleModal";
import { UserMessageModal } from "./UserMessageModal";
import { UserTableRow } from "./UserTableRow";
import { UserRecipesList } from "./UserRecipesList";
import { InviteUsersModal } from "./InviteUsersModal";
import { useUserManagement } from "@/hooks/useUserManagement";

interface BackofficeUsersProps {
  searchQuery: string;
}

export function BackofficeUsers({ searchQuery }: BackofficeUsersProps) {
  const [customRoleModalOpen, setCustomRoleModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");
  const [availableRoles, setAvailableRoles] = useState<string[]>([
    "user",
    "admin",
    "superadmin"
  ]);

  const {
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
  } = useUserManagement(searchQuery);

  const handleAddCustomRole = (role: string) => {
    if (!availableRoles.includes(role)) {
      setAvailableRoles(prev => [...prev, role]);
    }
  };

  if (isLoading) return <div className="p-4">Loading users data...</div>;
  if (!users) return <div className="p-4">No users found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button onClick={() => setInviteModalOpen(true)}>
          Invite Users
        </Button>
      </div>

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
          {users.map((user) => (
            <React.Fragment key={user.id}>
              <UserTableRow
                user={user}
                editingId={editingId}
                editName={editName}
                availableRoles={availableRoles}
                onEdit={(id) => {
                  setEditingId(id);
                  setEditName(user.name);
                }}
                onEditNameChange={setEditName}
                onEditSave={handleEdit}
                onEditCancel={() => setEditingId(null)}
                onRoleChange={handleRoleChange}
                onDelete={handleDelete}
                onMessageOpen={(id, email) => {
                  setSelectedUserId(id);
                  setSelectedUserEmail(email);
                  setMessageModalOpen(true);
                }}
                onToggleExpand={toggleUserExpansion}
                onAddCustomRole={() => setCustomRoleModalOpen(true)}
                isExpanded={expandedUsers.includes(user.id)}
              />
              {expandedUsers.includes(user.id) && (
                <UserRecipesList key={`recipes-${user.id}`} userId={user.id} recipes={user.recipes} />
              )}
            </React.Fragment>
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

      <InviteUsersModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        recipe={null}
      />
    </div>
  );
}