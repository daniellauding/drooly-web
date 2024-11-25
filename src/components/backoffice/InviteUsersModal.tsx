import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Loader2, Mail } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface InviteUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUsersModal({ open, onOpenChange }: InviteUsersModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");
  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [marketingOptions, setMarketingOptions] = useState({
    popularRecipes: false,
    topCreators: false
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleSendInvites = async () => {
    if (emails.length === 0) return;

    setSending(true);
    try {
      console.log("Creating invites for emails:", emails);
      
      const invitesCollection = collection(db, "invites");
      const invitePromises = emails.map(async (email) => {
        const inviteData = {
          email,
          role: selectedRole,
          message: customMessage,
          status: "pending",
          createdAt: new Date(),
          createdBy: user?.uid,
          signupUrl: `${window.location.origin}/register?invite=${btoa(email)}&role=${selectedRole}`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          marketingContent: marketingOptions
        };
        
        console.log("Creating invite:", inviteData);
        return addDoc(invitesCollection, inviteData);
      });

      await Promise.all(invitePromises);
      console.log("All invites created successfully");

      toast({
        title: "Invites created successfully",
        description: `Created ${emails.length} invites. Note: Email sending is not yet implemented.`
      });
      
      onOpenChange(false);
      setEmails([]);
      setSelectedRole("user");
      setCustomMessage("");
      setMarketingOptions({ popularRecipes: false, topCreators: false });
    } catch (error) {
      console.error("Error creating invites:", error);
      toast({
        variant: "destructive",
        title: "Error creating invites",
        description: "Please try again later."
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Users to Drooly</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Superadmin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Add Recipients</label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
              />
              <Button onClick={handleAddEmail} type="button">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {emails.map((email) => (
                <div
                  key={email}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {email}
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className="hover:text-primary/70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Marketing Content</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="popularRecipes"
                  checked={marketingOptions.popularRecipes}
                  onCheckedChange={(checked) => 
                    setMarketingOptions(prev => ({ ...prev, popularRecipes: checked as boolean }))
                  }
                />
                <label htmlFor="popularRecipes">Include popular recipes</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="topCreators"
                  checked={marketingOptions.topCreators}
                  onCheckedChange={(checked) => 
                    setMarketingOptions(prev => ({ ...prev, topCreators: checked as boolean }))
                  }
                />
                <label htmlFor="topCreators">Include top creators</label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Message (optional)</label>
            <Textarea
              placeholder="Add a personal message to your invitation..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="h-24"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSendInvites}
            disabled={emails.length === 0 || sending}
          >
            {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {sending ? 'Sending...' : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Invites
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}