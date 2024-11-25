import type { Meta, StoryObj } from '@storybook/react';
import { RecipeCard } from './RecipeCard';

const meta = {
  title: 'Components/RecipeCard',
  component: RecipeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    title: 'Delicious Pasta',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    cookTime: '30 mins',
    difficulty: 'Medium',
    chef: 'Gordon Ramsay',
    date: '2024-02-20',
  },
};

export const NoImage: Story = {
  args: {
    id: '2',
    title: 'Simple Recipe',
    cookTime: '15 mins',
    difficulty: 'Easy',
  },
};

export const Favorite: Story = {
  args: {
    id: '3',
    title: 'Favorite Dish',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    cookTime: '45 mins',
    difficulty: 'Hard',
    isFavorite: true,
    chef: 'Jamie Oliver',
    date: '2024-02-21',
  },
};