import type { Meta } from '@storybook/react';
import { ColorPalette, ColorItem } from '@storybook/blocks';

const meta: Meta = {
  title: 'Design System/Colors',
};

export default meta;

export const Colors = () => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold">Design System</h1>
    
    <div>
      <h2 className="text-xl font-semibold mb-4">Colors</h2>
      <ColorPalette>
        <ColorItem
          title="Primary"
          colors={{
            'primary': 'hsl(var(--primary))',
            'primary-foreground': 'hsl(var(--primary-foreground))',
          }}
        />
        <ColorItem
          title="Secondary"
          colors={{
            'secondary': 'hsl(var(--secondary))',
            'secondary-foreground': 'hsl(var(--secondary-foreground))',
          }}
        />
        <ColorItem
          title="Destructive"
          colors={{
            'destructive': 'hsl(var(--destructive))',
            'destructive-foreground': 'hsl(var(--destructive-foreground))',
          }}
        />
        <ColorItem
          title="Muted"
          colors={{
            'muted': 'hsl(var(--muted))',
            'muted-foreground': 'hsl(var(--muted-foreground))',
          }}
        />
        <ColorItem
          title="Accent"
          colors={{
            'accent': 'hsl(var(--accent))',
            'accent-foreground': 'hsl(var(--accent-foreground))',
          }}
        />
      </ColorPalette>
    </div>
  </div>
);