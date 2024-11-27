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
    stats: {
      likes: []
    }
  },
};

export const WithLikes: Story = {
  args: {
    id: '2',
    title: 'Popular Recipe',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    cookTime: '45 mins',
    difficulty: 'Easy',
    chef: 'Jamie Oliver',
    date: '2024-02-21',
    stats: {
      likes: ['user1', 'user2', 'user3']
    }
  },
};

export const NoImage: Story = {
  args: {
    id: '3',
    title: 'Simple Recipe',
    cookTime: '15 mins',
    difficulty: 'Easy',
    stats: {
      likes: []
    }
  },
};

export const Dismissible: Story = {
  args: {
    id: '4',
    title: 'Dismissible Recipe',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    cookTime: '20 mins',
    difficulty: 'Medium',
    onDismiss: () => console.log('Recipe dismissed'),
    stats: {
      likes: []
    }
  },
};