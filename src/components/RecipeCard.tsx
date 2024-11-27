import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { RecipeImage } from "./recipe/RecipeImage";
import { RecipeInfo } from "./recipe/RecipeInfo";

export interface RecipeCardProps {
  id: string;
  title: string;
  image?: string;
  cookTime?: string;
  difficulty: string;
  isFavorite?: boolean;
  chef?: string;
  date?: string;
  images?: string[];
  featuredImageIndex?: number;
  creatorId?: string;
  stats?: {
    likes?: string[];
    saves?: string[];
  };
  onDismiss?: () => void;
}

export function RecipeCard({ 
  id,
  title, 
  image,
  images,
  featuredImageIndex = 0,
  cookTime, 
  difficulty, 
  chef,
  date,
  creatorId,
  stats,
  onDismiss
}: RecipeCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Navigating to recipe:', id);
    navigate(`/recipe/${id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Navigating to edit recipe:', id);
    navigate(`/recipe/edit/${id}`);
  };

  const getFeaturedImage = () => {
    if (images && images.length > 0) {
      const featuredImage = images[featuredImageIndex] || images[0];
      return featuredImage?.startsWith('blob:') ? '/placeholder.svg' : featuredImage;
    }
    return image || '/placeholder.svg';
  };

  return (
    <Card 
      className="overflow-hidden bg-white border rounded-3xl transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      <RecipeImage
        id={id}
        image={getFeaturedImage()}
        creatorId={creatorId}
        stats={stats}
        onDismiss={onDismiss}
        onEdit={handleEdit}
      />
      <RecipeInfo
        title={title}
        chef={chef}
        date={date}
        cookTime={cookTime}
        difficulty={difficulty}
      />
    </Card>
  );
}