export interface Recipe {
  id: string;
  title: string;
  description?: string;
  chef?: string;
  date?: string;
  cookTime?: string;
  difficulty?: string;
  images?: string[];
  featuredImageIndex?: number;
  creatorId?: string;
  stats?: {
    views: number;
    likes: string[];
    comments: number;
    saves?: string[];
  };
}