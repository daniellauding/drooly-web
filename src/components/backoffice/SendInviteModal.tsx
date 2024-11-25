import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";
import { Plus, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface SendInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | null;
  remainingInvites?: number;
  onInviteSent?: () => void;
}

export function SendInviteModal({ 
  open, 
  onOpenChange, 
  recipe,
  remainingInvites = Infinity,
  onInviteSent
}: SendInviteModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail) && emails.length < remainingInvites) {
      setEmails([...emails, newEmail]);
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleSend = async () => {
    if (emails.length === 0) return;

    setSending(true);
    try {
      console.log("Creating invites for emails:", emails);
      
      const invitesCollection = collection(db, "invites");
      const domain = import.meta.env.VITE_CUSTOM_DOMAIN || window.location.host;

      const invitePromises = emails.map(async (email) => {
        const signupUrl = `${window.location.protocol}//${domain}/register?invite=${btoa(email)}&role=user`;
        
        const inviteData = {
          email,
          role: 'user',
          message,
          status: "pending",
          createdAt: new Date(),
          createdBy: user?.uid,
          signupUrl,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          marketingContent: {
            popularRecipes: true,
            topCreators: true
          }
        };
        
        console.log("Creating invite:", inviteData);
        return addDoc(invitesCollection, inviteData);
      });

      await Promise.all(invitePromises);
      console.log("All invites created successfully");

      toast({
        title: "Invites sent successfully",
        description: `Sent invites to ${emails.length} recipients`
      });

      onInviteSent?.();
      onOpenChange(false);
      setEmails([]);
      setMessage("");
    } catch (error) {
      console.error("Error sending invites:", error);
      toast({
        variant: "destructive",
        title: "Error sending invites",
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
          <DialogTitle>Invite Friends to Drooly</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {recipe && (
            <div>
              <label className="text-sm font-medium">Recipe</label>
              <p className="text-muted-foreground">{recipe.title}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Add Recipients ({remainingInvites - emails.length} invites remaining)</label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
                disabled={emails.length >= remainingInvites}
              />
              <Button 
                onClick={handleAddEmail} 
                type="button"
                disabled={emails.length >= remainingInvites}
              >
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
            <label className="text-sm font-medium">Message (optional)</label>
            <Textarea
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSend}
            disabled={emails.length === 0 || sending}
          >
            {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {sending ? 'Sending...' : 'Send Invites'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}