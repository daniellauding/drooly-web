import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { InviteForm } from "./InviteForm";
import { MarketingOptions } from "./MarketingOptions";
import { InviteLink } from "./InviteLink";

interface InviteUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUsersModal({ open, onOpenChange }: InviteUsersModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState("user");
  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [marketingOptions, setMarketingOptions] = useState({
    popularRecipes: false,
    topCreators: false
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSendInvites = async () => {
    if (!emails.length || !user?.emailVerified) {
      toast({
        variant: "destructive",
        title: "Error",
        description: user?.emailVerified 
          ? "Please add at least one email address."
          : "Please verify your email before sending invites."
      });
      return;
    }

    setSending(true);
    try {
      console.log("Creating invites for emails:", emails);
      
      const invitesCollection = collection(db, "invites");
      const invitePromises = emails.map(async (email) => {
        const domain = import.meta.env.VITE_CUSTOM_DOMAIN || window.location.host;
        const signupUrl = `${window.location.protocol}//${domain}/register?invite=${btoa(email)}&role=${selectedRole}`;
        
        const inviteData = {
          email,
          role: selectedRole,
          message: customMessage,
          status: "pending",
          createdAt: new Date(),
          createdBy: user.uid,
          signupUrl,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          marketingContent: marketingOptions
        };
        
        console.log("Creating invite:", inviteData);
        return addDoc(invitesCollection, inviteData);
      });

      await Promise.all(invitePromises);
      console.log("All invites created successfully");

      toast({
        title: "Invites created successfully",
        description: `Created ${emails.length} invites`
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
        description: "Please ensure you have the necessary permissions and try again."
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
          <DialogDescription>
            Send invites to users you'd like to join Drooly. They'll receive a unique signup link.
          </DialogDescription>
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

          <InviteForm emails={emails} setEmails={setEmails} />

          {emails.map((email) => (
            <div key={email} className="space-y-2">
              <label className="text-sm font-medium">Invite Link for {email}</label>
              <InviteLink email={email} role={selectedRole} />
            </div>
          ))}

          <MarketingOptions 
            options={marketingOptions}
            onChange={setMarketingOptions}
          />

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