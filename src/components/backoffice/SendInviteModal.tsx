import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";
import { Plus, Loader2 } from "lucide-react";

interface SendInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | null;
}

export function SendInviteModal({ open, onOpenChange, recipe }: SendInviteModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleSend = async () => {
    if (!recipe || emails.length === 0) return;

    setSending(true);
    try {
      // Here you would implement the actual email sending logic
      // For now, we'll just simulate it with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Invites sent successfully",
        description: `Sent invites to ${emails.length} recipients`
      });
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
          <DialogTitle>Send Recipe Invitation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Recipe</label>
            <p className="text-muted-foreground">{recipe?.title}</p>
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