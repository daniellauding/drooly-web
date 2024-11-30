export interface EventGuest {
  id: string;
  name: string;
  status: 'coming' | 'not-coming' | 'pending';
  plusOne: boolean;
  dietaryRestrictions: string;
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
  location: {
    name: string;
    address: string;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  guests: EventGuest[];
  dishes: EventDish[];
  notes?: string;
  isPrivate: boolean;
  password?: string;
}