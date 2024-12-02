import { ChefHat, CalendarDays, ListTodo, Globe, Camera, Link, ClipboardPaste } from "lucide-react";

export const bentoBoxes = [
  {
    title: "What's in your kitchen?",
    description: "Find recipes using ingredients you have",
    icon: ChefHat,
    action: "kitchen",
    color: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
    textColor: "text-purple-700"
  },
  {
    title: "Plan an Event",
    description: "Organize food events with friends and family",
    icon: CalendarDays,
    action: "events",
    color: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    title: "My Planning",
    description: "Manage your shopping list and meal plans",
    icon: ListTodo,
    action: "todo",
    color: "bg-green-50",
    hoverColor: "hover:bg-green-100",
    textColor: "text-green-700"
  },
  {
    title: "Explore Cuisines",
    description: "Discover recipes from around the world",
    icon: Globe,
    action: "cuisine",
    color: "bg-orange-50",
    hoverColor: "hover:bg-orange-100",
    textColor: "text-orange-700"
  },
  {
    title: "Take Photo & Scan",
    description: "Import recipes from photos",
    icon: Camera,
    action: "photo",
    color: "bg-pink-50",
    hoverColor: "hover:bg-pink-100",
    textColor: "text-pink-700"
  },
  {
    title: "Import from URL",
    description: "Convert any recipe to your collection",
    icon: Link,
    action: "url",
    color: "bg-indigo-50",
    hoverColor: "hover:bg-indigo-100",
    textColor: "text-indigo-700"
  },
  {
    title: "Paste from Clipboard",
    description: "Import recipes from your clipboard",
    icon: ClipboardPaste,
    action: "clipboard",
    color: "bg-teal-50",
    hoverColor: "hover:bg-teal-100",
    textColor: "text-teal-700"
  }
];