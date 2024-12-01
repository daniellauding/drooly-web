export interface EventGuest {
  id: string;
  name: string;
  status: 'coming' | 'not-coming' | 'pending';
  plusOne: boolean;
  dietaryRestrictions: string;
  role?: 'admin' | 'guest';
  cooking?: {
    recipeId?: string;
    recipeName: string;
  };
}

export interface EventDish {
  id: string;
  name: string;
  assignedTo: string;
  recipeId?: string;
  ingredients: string[];
  notes?: string;
  courseType?: 'appetizer' | 'main' | 'dessert' | 'drinks';
  votes: {
    likes: string[];
    dislikes: string[];
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  coverImage?: string;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  guests: EventGuest[];
  dishes: EventDish[];
  notes?: string;
  isPrivate: boolean;
  isHidden?: boolean;
  password?: string;
}