import { Recipe } from "@/types/recipe";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Heart, MessageSquare, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecipeTableRowProps {
  recipe: Recipe & { 
    stats?: { 
      likes?: number;
      comments?: number;
      shares?: number;
    }
  };
  editingId: string | null;
  editTitle: string;
  isExpanded: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onTitleChange: (value: string) => void;
  onToggleExpand: () => void;
}

export function RecipeTableRow({
  recipe,
  editingId,
  editTitle,
  isExpanded,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onTitleChange,
  onToggleExpand
}: RecipeTableRowProps) {
  const navigate = useNavigate();

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <span className="text-xs text-muted-foreground font-mono">
          {recipe.id}
        </span>
      </TableCell>
      <TableCell>
        {editingId === recipe.id ? (
          <div className="flex gap-2">
            <Input
              value={editTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full"
            />
            <Button size="sm" onClick={() => onSave(recipe.id!)}>Save</Button>
            <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        ) : (
          <span 
            className="cursor-pointer hover:underline"
            onClick={() => onEdit(recipe.id!)}
          >
            {recipe.title}
          </span>
        )}
      </TableCell>
      <TableCell>{recipe.creatorName || 'Unknown'}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="text-sm">
            Created: {recipe.createdAt ? new Date(recipe.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
          </div>
          {recipe.updatedAt && (
            <div className="text-xs text-muted-foreground">
              Updated: {new Date(recipe.updatedAt.seconds * 1000).toLocaleDateString()}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{recipe.stats?.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span>{recipe.stats?.comments || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4 text-green-500" />
            <span>{recipe.stats?.shares || 0}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => navigate(`/recipe/${recipe.id}`)}>View</Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onDelete(recipe.id!)}
          >
            Delete
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggleExpand}
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