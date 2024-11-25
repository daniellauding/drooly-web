import type { Meta, StoryObj } from '@storybook/react';

interface ColorItemProps {
  color: string;
  name: string;
}

const ColorItem = ({ color, name }: ColorItemProps) => (
  <div className="flex items-center gap-4">
    <div 
      className="w-16 h-16 rounded-lg shadow-md" 
      style={{ backgroundColor: color }}
    />
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-muted-foreground">{color}</p>
    </div>
  </div>
);

interface ColorDisplayProps {
  title: string;
  subtitle: string;
  colors: Record<string, string>;
}

const ColorDisplay = ({ title, subtitle, colors }: ColorDisplayProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid gap-4">
        {Object.entries(colors).map(([name, color]) => (
          <ColorItem key={name} name={name} color={color} />
        ))}
      </div>
    </div>
  );
};

const meta: Meta<typeof ColorDisplay> = {
  title: 'Design System/Colors',
  component: ColorDisplay,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ColorDisplay>;

export const Primary: Story = {
  args: {
    title: 'Color Palette',
    subtitle: 'Our design system color palette',
    colors: {
      primary: '#0066CC',
      secondary: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },
};