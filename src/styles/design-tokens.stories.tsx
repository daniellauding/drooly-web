import type { Meta, StoryObj } from "@storybook/react";

interface ColorItem {
  title: string;
  subtitle: string;
  colors: Record<string, string>;
}

const ColorDisplay = ({ title, subtitle, colors }: ColorItem) => {
  return (
    <div className="space-y-2 mb-8">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <div className="space-y-2">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-md border"
              style={{ backgroundColor: value }}
            />
            <div>
              <div className="font-mono text-sm">{key}</div>
              <div className="text-sm text-muted-foreground">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const meta = {
  title: "Design Tokens",
  component: ColorDisplay,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ColorDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  args: {
    title: "Primary",
    subtitle: "Main brand color",
    colors: {
      primary: "hsl(var(--primary))",
      "primary-foreground": "hsl(var(--primary-foreground))",
    },
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-8 p-6">
      <ColorDisplay
        title="Primary"
        subtitle="Main brand color"
        colors={{
          primary: "hsl(var(--primary))",
          "primary-foreground": "hsl(var(--primary-foreground))",
        }}
      />
      <ColorDisplay
        title="Secondary"
        subtitle="Secondary interface color"
        colors={{
          secondary: "hsl(var(--secondary))",
          "secondary-foreground": "hsl(var(--secondary-foreground))",
        }}
      />
      <ColorDisplay
        title="Destructive"
        subtitle="Error and warning states"
        colors={{
          destructive: "hsl(var(--destructive))",
          "destructive-foreground": "hsl(var(--destructive-foreground))",
        }}
      />
      <ColorDisplay
        title="Muted"
        subtitle="Subtle interface elements"
        colors={{
          muted: "hsl(var(--muted))",
          "muted-foreground": "hsl(var(--muted-foreground))",
        }}
      />
      <ColorDisplay
        title="Accent"
        subtitle="Highlighted elements"
        colors={{
          accent: "hsl(var(--accent))",
          "accent-foreground": "hsl(var(--accent-foreground))",
        }}
      />
    </div>
  ),
};