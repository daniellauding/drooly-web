import { Button } from "@/components/ui/button";

interface FormFooterProps {
  onCancel: () => void;
  onSave: () => void;
  disabled?: boolean;
}

export function FormFooter({ onCancel, onSave, disabled = false }: FormFooterProps) {
  return (
    <div className="flex justify-end space-x-4 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        disabled={disabled}
      >
        Save Changes
      </Button>
    </div>
  );
}