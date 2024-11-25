import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Edit3, Users, Camera } from "lucide-react";

const Create = () => {
  const navigate = useNavigate();
  
  const options = [
    {
      title: "Create & Share",
      description: "Keep all your recipes in one place and share them with friends.",
      icon: Edit3,
      path: "/create-recipe"  // Updated to match the route in App.tsx
    },
    {
      title: "Plan Together",
      description: "Create meal plans and organize food events with loved ones.",
      icon: Users,
      path: "/plan"
    },
    {
      title: "Share Stories",
      description: "Share your weekly food adventures and inspire others.",
      icon: Camera,
      path: "/stories/create"
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Create Something Amazing</h1>
      
      <div className="grid gap-6">
        {options.map((option) => (
          <Card
            key={option.title}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(option.path)}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <option.icon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">{option.title}</h2>
                <p className="text-gray-600">{option.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Create;