import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
    toast({
      title: "Cookies accepted",
      description: "Your preferences have been saved"
    });
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
    toast({
      title: "Cookies declined",
      description: "Only essential cookies will be used"
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50">
      <p className="text-gray-600 text-base mb-6">
        We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
      </p>
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={handleDecline}
          className="text-gray-600 hover:text-gray-800"
        >
          Decline
        </Button>
        <Button 
          onClick={handleAccept}
          className="bg-[#E91E63] hover:bg-[#D81B60] text-white"
        >
          Accept
        </Button>
      </div>
    </div>
  );
}