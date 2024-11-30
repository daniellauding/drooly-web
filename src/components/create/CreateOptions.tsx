import { Edit3, Users, Camera, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const createOptions = [
  {
    title: "Create & Share",
    description: "Keep all your recipes in one place and share them with friends.",
    icon: Edit3,
    path: "/create-recipe"
  },
  {
    title: "Recipe from Photo",
    description: "Take a photo of any dish and let AI suggest a recipe.",
    icon: Camera,
    path: "/create-recipe?mode=photo"
  },
  {
    title: "Plan Together",
    description: "Create meal plans and organize food events with loved ones.",
    icon: Users,
    path: "/create-event"
  },
  {
    title: "Share Stories",
    description: "Share your weekly food adventures and inspire others.",
    icon: ImageIcon,
    path: "/stories/create"
  }
];

export function CreateOptions() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      {createOptions.map((option) => (
        <button
          key={option.title}
          className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
          onClick={() => navigate(option.path)}
        >
          <div className="p-2 rounded-full bg-purple-100">
            <option.icon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold">{option.title}</h3>
            <p className="text-sm text-gray-600">{option.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}