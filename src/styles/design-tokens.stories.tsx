import { Meta, StoryObj } from "@storybook/react";
import { ColorItemProps } from "@stitches/react";
import { ColorItems } from "./ColorItems";

const meta: Meta = {
  title: "Design Tokens",
  component: ColorItems,
};

export default meta;

const ColorItems: ColorItemProps[] = [
  {
    title: "Primary",
    subtitle: "Main brand color",
    colors: {
      primary: "hsl(var(--primary))",
      "primary-foreground": "hsl(var(--primary-foreground))",
    },
  },
  {
    title: "Secondary",
    subtitle: "Secondary interface color",
    colors: {
      secondary: "hsl(var(--secondary))",
      "secondary-foreground": "hsl(var(--secondary-foreground))",
    },
  },
  {
    title: "Destructive",
    subtitle: "Error and warning states",
    colors: {
      destructive: "hsl(var(--destructive))",
      "destructive-foreground": "hsl(var(--destructive-foreground))",
    },
  },
  {
    title: "Muted",
    subtitle: "Subtle interface elements",
    colors: {
      muted: "hsl(var(--muted))",
      "muted-foreground": "hsl(var(--muted-foreground))",
    },
  },
  {
    title: "Accent",
    subtitle: "Highlighted elements",
    colors: {
      accent: "hsl(var(--accent))",
      "accent-foreground": "hsl(var(--accent-foreground))",
    },
  },
];

const ColorItem = (props: ColorItemProps) => {
  return (
    <div>
      <h3>{props.title}</h3>
      <p>{props.subtitle}</p>
      <div>
        {Object.entries(props.colors).map(([key, value]) => (
          <div key={key} style={{ backgroundColor: value }}>
            {key}: {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Default: StoryObj = {
  render: () => (
    <div>
      {ColorItems.map((item, index) => (
        <ColorItem key={index} {...item} />
      ))}
    </div>
  ),
};
