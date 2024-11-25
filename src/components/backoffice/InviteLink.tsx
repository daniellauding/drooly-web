import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InviteLinkProps {
  email: string;
  role: string;
}

export function InviteLink({ email, role }: InviteLinkProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const inviteUrl = `${window.location.origin}/register?invite=${btoa(email)}&role=${role}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Invite link has been copied to clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link to clipboard"
      });
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Input 
        value={inviteUrl}
        readOnly
        className="font-mono text-sm"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={copyToClipboard}
        className="shrink-0"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}