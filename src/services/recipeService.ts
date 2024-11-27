import { Timestamp } from "firebase/firestore";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  creatorId: string;
  creatorName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  images: string[];
  featuredImageIndex?: number;
  totalTime?: string;
  difficulty?: string;
  stats?: {
    likes?: string[];
    saves?: string[];
    views?: number;
  };
  tags?: string[];
}
