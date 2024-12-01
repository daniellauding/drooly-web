import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SUBJECT_OPTIONS = [
  { value: "help", label: "I wanna help" },
  { value: "idea", label: "I have an idea" },
  { value: "issue", label: "Issue related" },
  { value: "feedback", label: "General feedback" }
];

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const resetForm = () => {
    setSubject("");
    setEmail("");
    setMessage("");
    setSending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting feedback submission process");
    
    if (!email || !subject || !message) {
      console.log("Validation failed:", { email, subject, message });
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    setSending(true);
    console.log("Preparing feedback data for submission");

    try {
      const feedbackRef = collection(db, 'feedback');
      
      // Create feedback data with only the allowed fields
      const feedbackData = {
        email,
        subject: SUBJECT_OPTIONS.find(opt => opt.value === subject)?.label || subject,
        message,
        ...(user?.uid ? { userId: user.uid } : {})
      };

      console.log("Submitting feedback data:", feedbackData);
      
      const docRef = await addDoc(feedbackRef, feedbackData);
      console.log("Feedback submitted successfully with ID:", docRef.id);

      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will review it soon.",
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending feedback:", error);
      
      toast({
        variant: "destructive",
        title: "Error sending feedback",
        description: "Please try again later.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Share your thoughts with us to help improve Drooly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Your Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your Email"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Subject
            </label>
            <Select value={subject} onValueChange={setSubject} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Tell us what you think..."
              className="h-32 bg-background"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={sending}
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Feedback'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}