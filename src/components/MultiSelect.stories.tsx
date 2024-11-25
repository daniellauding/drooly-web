import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelect } from './MultiSelect';

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    selected: ['Option 1'],
    placeholder: 'Select items...',
  },
};

export const Empty: Story = {
  args: {
    options: ['Red', 'Blue', 'Green', 'Yellow'],
    selected: [],
    placeholder: 'Choose colors...',
  },
};

export const ManyOptions: Story = {
  args: {
    options: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'],
    selected: ['Item 1', 'Item 3', 'Item 5'],
    placeholder: 'Select multiple items...',
  },
};