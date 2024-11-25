import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";
import { Loader2, Mail } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { InviteForm } from "./InviteForm";
import { MarketingOptions } from "./MarketingOptions";
import { InviteLink } from "./InviteLink";

interface InviteUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | null;
  remainingInvites?: number;
  onInviteSent?: () => void;
}

export function InviteUsersModal({ 
  open, 
  onOpenChange, 
  recipe,
  remainingInvites = Infinity,
  onInviteSent
}: InviteUsersModalProps) {
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
    if (!emails.length || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add at least one email address."
      });
      return;
    }

    setSending(true);
    try {
      console.log("Checking user role...");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      const isSuperAdmin = userData?.role === 'superadmin';
      console.log("User role check - Is superadmin:", isSuperAdmin);
      
      if (!isSuperAdmin && !user.emailVerified) {
        console.log("User is not superadmin and email is not verified");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please verify your email before sending invites."
        });
        return;
      }

      console.log("Creating invites for emails:", emails);
      
      const invitesCollection = collection(db, "invites");
      const domain = import.meta.env.VITE_CUSTOM_DOMAIN || window.location.host;

      const invitePromises = emails.map(async (email) => {
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
        title: "Invites sent successfully",
        description: `Sent invites to ${emails.length} recipients`
      });

      onInviteSent?.();
      onOpenChange(false);
      setEmails([]);
      setCustomMessage("");
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
          {recipe && (
            <div>
              <label className="text-sm font-medium">Recipe</label>
              <p className="text-muted-foreground">{recipe.title}</p>
            </div>
          )}

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