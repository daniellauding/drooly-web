import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface InviteFormProps {
  emails: string[];
  setEmails: (emails: string[]) => void;
}

export function InviteForm({ emails, setEmails }: InviteFormProps) {
  const [newEmail, setNewEmail] = useState("");

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  return (
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
  );
}