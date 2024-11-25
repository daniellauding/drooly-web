import { Recipe } from "@/types/recipe";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Pencil, Save, X, Trash } from "lucide-react";
import { format } from "date-fns";

interface RecipeTableRowProps {
  recipe: Recipe;
  editingId: string | null;
  isExpanded: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string, updates: Partial<Recipe>) => Promise<void>;
  onCancel: () => void;
  onDelete: (id: string) => Promise<void>;
  onToggleExpand: () => void;
}

export function RecipeTableRow({
  recipe,
  editingId,
  isExpanded,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleExpand
}: RecipeTableRowProps) {
  const isEditing = editingId === recipe.id;
  const createdDate = recipe.createdAt ? new Date(recipe.createdAt.seconds * 1000) : null;
  const updatedDate = recipe.updatedAt ? new Date(recipe.updatedAt.seconds * 1000) : null;

  return (
    <TableRow>
      <TableCell className="font-mono text-sm">{recipe.id}</TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            defaultValue={recipe.title}
            onChange={(e) => {
              // Handle title change
            }}
          />
        ) : (
          recipe.title
        )}
      </TableCell>
      <TableCell>{recipe.creator?.name || 'Unknown'}</TableCell>
      <TableCell>{recipe.source || 'Direct'}</TableCell>
      <TableCell className="text-sm">
        <div>Created: {createdDate ? format(createdDate, 'MMM d, yyyy') : 'Unknown'}</div>
        {updatedDate && (
          <div className="text-muted-foreground">
            Updated: {format(updatedDate, 'MMM d, yyyy')}
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div>Views: {recipe.views || 0}</div>
          <div>Likes: {recipe.likes?.length || 0}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                onClick={() => onSave(recipe.id!, {})}
                className="h-8 px-2"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancel}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(recipe.id!)}
                className="h-8 px-2"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(recipe.id!)}
                className="h-8 px-2 text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleExpand}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
}
