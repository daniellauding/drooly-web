import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Recipe } from "@/types/recipe";

interface AIConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (mergeOption: 'keep' | 'replace' | 'merge') => void;
  mergeOption: 'keep' | 'replace' | 'merge';
  setMergeOption: (value: 'keep' | 'replace' | 'merge') => void;
}

export function AIConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  mergeOption,
  setMergeOption
}: AIConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>How would you like to use the AI suggestions?</AlertDialogTitle>
          <AlertDialogDescription>
            Choose how to incorporate the AI-generated suggestions into your recipe.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <RadioGroup value={mergeOption} onValueChange={(value: 'keep' | 'replace' | 'merge') => setMergeOption(value)} className="gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="keep" id="keep" />
            <Label htmlFor="keep">Keep current data</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="replace" id="replace" />
            <Label htmlFor="replace">Use AI suggestions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="merge" id="merge" />
            <Label htmlFor="merge">Merge current data with AI suggestions</Label>
          </div>
        </RadioGroup>

        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onConfirm(mergeOption)}>Confirm</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}